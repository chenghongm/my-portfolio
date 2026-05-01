import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import styles from "../styles/GeminiStyle.module.css";
import {
  trackActivity,
  trackInteraction,
  PROJECTS,
  EXPERIENCES,
  WORK_CARDS,
  SYSTEM_PROMPTS,
  buildSystemPrompt,
  TERMINALS,
  CONTACT_INFO,
  HERO_INFO,
  SKILLS,
  INITIAL_PROMPT_HOOKS,
  getFollowupHooks
} from '../lib/sharedfunctions';

const PAGE_ID = 'gemini-style';
const PROMPT_CHAR_LIMIT = 300;

function SectionHeader({ num, label }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionNum}>{num}</span>
      <span className={styles.sectionLine} />
      <span className={styles.sectionLabel}>{label}</span>
    </div>
  );
}

function WindowFrame({ title, children, id, className = "", compact = false }) {
  return (
    <section id={id} className={`${styles.win95Window} ${className}`} onClick={() => id && trackActivity(PAGE_ID, "click", id)}>
      <div className={styles.win95Header}>
        <span>{title}</span>
        <div className={styles.win95Controls} aria-hidden="true">
          <span className={styles.win95Btn}>
            <span className={styles.iconMin} />
          </span>
          <span className={styles.win95Btn}>
            <span className={styles.iconMax} />
          </span>
          <span className={styles.win95Btn}>
            <span className={styles.iconClose}>×</span>
          </span>
        </div>
      </div>
      <div className={compact ? `${styles.win95Body} ${styles.compact}` : styles.win95Body}>{children}</div>
    </section>
  );
}

function ProjectCard({ project }) {
  const isWide = project.num === "01" || project.num === "04";
  return (
    <WindowFrame
      id={project.id}
      title={project.windowTitle}
      className={isWide ? `${styles.projectWindow} ${styles.projectWindowWide}` : styles.projectWindow}
      compact
    >
      <div className={`${styles.projectPanel} win95-inset`}>
        <div className={styles.projectCardTop}>
          <div>
            <div className={styles.projectId}>{project.num}</div>
            <h3 className={styles.projectTitle}>{project.title}</h3>
          </div>
          <div className={styles.projectSide}>
            <div className={styles.projectStatus}>{project.status}</div>
            <div className={styles.projectYear}>{project.year}</div>
          </div>
        </div>
        <p className={styles.projectDesc}>{project.description}</p>
        <div className={styles.projectTags} aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.projectTag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}

function ContactBlock() {
  return (
    <WindowFrame id="contact_block" title="CONTACT://CHANNELS.SYS" className={styles.contactWindow} compact>
      <div className={styles.contactGrid}>
        {CONTACT_INFO.map((info) => (
          <a
            key={info.id}
            className={styles.contactLink}
            href={info.href}
            target={info.href.startsWith('http') ? "_blank" : undefined}
            rel="noreferrer"
            onClick={() => trackActivity(PAGE_ID, "click", info.id)}
          >
            {info.icon && <span>{info.icon} </span>}{info.label}
          </a>
        ))}
      </div>
    </WindowFrame>
  );
}

export default function Home() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isNeuralLinkMaximized, setIsNeuralLinkMaximized] = useState(false);
  const [time, setTime] = useState("");
  const [visibleHooks, setVisibleHooks] = useState(INITIAL_PROMPT_HOOKS);
  const terminalBodyRef = useRef(null);

  // Wrap trackActivity for convenience
  const track = (event, sectionId, extra) => trackActivity(PAGE_ID, event, sectionId, extra);

  // ✅ Invisible 模式正确写法（先 render，再 execute）
  const getToken = () => {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      window.turnstile.render(container, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        action: "chat",
        appearance: "execute",
        callback: (token) => {
          resolve(token);
          document.body.removeChild(container); // 清理 DOM
        },
      });
    });
  };

  useEffect(() => {
    track("session_start", "page_load");
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    const now = new Date();
    setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (!isNeuralLinkMaximized) return undefined;

    window.scrollTo({ top: 0, behavior: "smooth" });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNeuralLinkMaximized(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNeuralLinkMaximized]);

  const submitPrompt = async (rawPrompt, source = "typed", hookType = null) => {
    const userMsg = rawPrompt.trim();
    if (!userMsg || isThinking) return;

    if (userMsg.length > PROMPT_CHAR_LIMIT) {
      setHistory((prev) => [...prev, { role: "assistant", content: `ERROR: Prompt limit is ${PROMPT_CHAR_LIMIT} characters.` }]);
      setVisibleHooks(getFollowupHooks(userMsg));
      return;
    }

    setInput("");
    const updatedHistory = [...history, { role: "user", content: userMsg }];
    setHistory(updatedHistory);
    setIsThinking(true);

    if (source === "hook") {
      track("hook_click", "gemini_terminal", { hook_type: hookType, prompt_text: userMsg });
    } else {
      track("chat_submit", "gemini_terminal");
    }

    try {
      const token = await getToken();
      const response = await fetch("/api/chat-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt(SYSTEM_PROMPTS.GEMINI, updatedHistory),
          messages: [{ role: 'user', content: userMsg }],
          turnstile_token: token,
        }),
      });
      const data = await response.json();
      const aiMsg = data.content?.[0]?.text || data.reply || "COMMAND_NOT_FOUND";
      setHistory((prev) => [...prev, { role: "assistant", content: aiMsg }]);
      trackInteraction(userMsg, "gemini-1.5-flash", aiMsg);
    } catch (err) {
      setHistory((prev) => [...prev, { role: "assistant", content: `ERROR: ${err.message}` }]);
    } finally {
      setVisibleHooks(getFollowupHooks(userMsg));
      setIsThinking(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e.key === "Enter") {
      await submitPrompt(input, "typed");
    }
  };

  const handleHookClick = async (prompt, hookType = "followup_hook") => {
    await submitPrompt(prompt, "hook", hookType);
  };

  const renderHooks = (hookType) => (
    <div className={styles.promptHookGroup}>
      {visibleHooks.map((hook) => (
        <button
          key={hook}
          type="button"
          className={styles.promptHook}
          disabled={isThinking}
          onClick={() => handleHookClick(hook, hookType)}
        >
          {hook}
        </button>
      ))}
    </div>
  );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      track("nav_click", id);
    }
  };

  return (
    <div className={styles.geminiTheme}>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <Head>
        {/* <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async></script> */}
        <link rel="icon" href="./assets/eyes.gif" sizes="any" type="image/png"></link>
        <title>Chenghong Meng | Full-Stack Developer</title>
        <meta
          name="description"
          content="Win95-style portfolio for Chenghong Meng, focused on backend systems, React, and LLM tooling."
        />
      </Head>
      <div className={styles.pageShell} id="top">
        <main className={styles.pageGrid}>
          <WindowFrame id="hero_window" title="IDENTITY_V95.SYS" className={styles.heroWindow}>
            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <h1 className={styles.heroTitle}>
                  {HERO_INFO.title}
                  <span className={styles.heroTitleSub}>{HERO_INFO.subTitle}</span>
                </h1>
                <div className={styles.heroSummary}>
                  {HERO_INFO.summary}
                </div>
                <div className={styles.heroMeta}>
                  {HERO_INFO.meta.map((m, i) => (
                    <div key={i} className={styles.metaCell}>
                      <div className={styles.metaLabel}>{m.label}</div>
                      <div className={`${styles.metaValue} ${m.status ? styles.metaValueGreen : ''}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.heroArtContainer}>
                <div
                  className={styles.miniTerminal}
                  onClick={() => scrollTo("sec_neural_link")}
                  title="Initialize Remote Neural Link"
                >
                  <span className={styles.terminalPrompt}>&gt;</span>
                  <span>CONNECT NEURAL_LINK.EXE<span className={styles.miniTerminalBlink}>_</span></span>
                </div>
                <pre className={styles.heroArt} aria-hidden="true">{HERO_INFO.art}</pre>
              </div>
            </div>
          </WindowFrame>

          <section className={styles.sectionBlock} id="sec_projects">
            <SectionHeader num="02" label="Projects" />
            <h2 className={styles.sectionHeading}>
              Selected
              <br />
              Projects.
            </h2>
            <div className={styles.projectsGrid}>
              {PROJECTS.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section className={styles.sectionBlock} id="sec_experience">
            <SectionHeader num="03" label="Experience" />
            <h2 className={styles.sectionHeading}>
              Professional
              <br />
              Journey.
            </h2>
            <div className={styles.experienceGrid}>
              {EXPERIENCES.map((exp) => (
                <WindowFrame key={exp.id} title={`EXP://${exp.id}.LOG`} id={exp.id}>
                   <div className={styles.expContent}>
                      <div className={styles.expTop}>
                        <div>
                          <h3 className={styles.expTitle}>{exp.title}</h3>
                          <div className={styles.expStatus}>{exp.status}</div>
                        </div>
                        <span className={styles.expDate}>{exp.dateRange}</span>
                      </div>
                      <p className={styles.expScope}>{exp.scope}</p>
                      {exp.projects && exp.projects.length > 0 && (
                        <div className={styles.expProjectsList}>
                          {exp.projects.map(p => (
                            <div key={p.id} id={p.id} className={styles.expProjItem} onClick={(e) => { e.stopPropagation(); track("click", p.id); }}>
                               <strong className={styles.expProjTitle}>{p.title}</strong>
                               {p.status && <p className={styles.expProjStatus}>{p.status}</p>}
                               {p.year && <p className={styles.expProjYear}>{p.year}</p>}
                               <p className={styles.expProjDesc}>{p.description}</p>
                               <div className={styles.expProjTags}>
                                  {p.tags.map(tag => (
                                    <span key={tag} className={styles.expProjTag}>{tag}</span>
                                  ))}
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                   </div>
                </WindowFrame>
              ))}
            </div>
          </section>

          {/* Neural Link Terminal */}
          <section className={styles.sectionBlock} id="sec_neural_link">
            <SectionHeader num="04" label="Neural Link" />
            <div
              className={`${styles.terminalWindow} ${isNeuralLinkMaximized ? styles.terminalWindowMaximized : ""} win95-inset`}
            >
              <div className={styles.win95Header} style={{ marginBottom: 0 }}>
                <span>📡 REMOTE_NEURAL_LINK.EXE (GEMINI_DIRECT)</span>
                <div className={styles.win95Controls}>
                  <button
                    type="button"
                    className={styles.win95Btn}
                    aria-label={isNeuralLinkMaximized ? "Restore Neural Link window" : "Maximize Neural Link window"}
                    title={isNeuralLinkMaximized ? "Restore" : "Maximize"}
                    onClick={() => setIsNeuralLinkMaximized((prev) => !prev)}
                  >
                    <span className={isNeuralLinkMaximized ? styles.iconMin : styles.iconMax} />
                  </button>
                </div>
              </div>
              <div className={styles.terminalBody} ref={terminalBodyRef}>
                <div className={styles.terminalLineAi}>[SYSTEM]: NEURAL LINK ESTABLISHED. <b className="text-yellow-500">ASK ME ANYTHING ABOUT PROJECTS. </b> POWERED BY GEMINI PRO.</div>
                <div className="text-[10px] font-mono mt-2">
                  <p className="text-yellow-500 "><b>NOTE:</b> {TERMINALS.GEMINI.alert}</p>
                  <p className="text-yellow-500 "><b>LIMIT:</b> Ask one prompt at a time, up to {PROMPT_CHAR_LIMIT} characters.</p>
                </div>
                {history.map((msg, i) => (
                  <div key={i} className={msg.role === "user" ? styles.terminalLineUser : styles.terminalLineAi}>
                    {msg.role === "user" ? `> ${msg.content}` : msg.content}
                  </div>
                ))}
                {renderHooks(history.length === 0 ? "initial_hook" : "followup_hook")}
                {isThinking && <div className="animate-pulse">THINKING...</div>}
              </div>
              <div className={styles.terminalInputArea}>
                <span className={styles.terminalPrompt}>&gt;</span>
                <div style={{ marginTop: '5px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '14px', background: '#F5A800', animation: 'blink 1s step-end infinite' }}></span>
                </div>
                <input
                  type="text"
                  className={styles.terminalInput}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, PROMPT_CHAR_LIMIT))}
                  onKeyDown={handleSubmit}
                  placeholder="Ask about my projects..."
                  maxLength={PROMPT_CHAR_LIMIT}
                />
                <span className={styles.terminalLimitHint}>{input.length}/{PROMPT_CHAR_LIMIT}</span>
              </div>
            </div>
          </section>

          <section className={styles.sectionBlock} id="sec_how_i_work">
            <SectionHeader num="05" label="How I work" />
            <div className={styles.workGrid}>
              {WORK_CARDS.map((card) => (
                <article key={card.id} id={card.id} className={styles.workCard} onClick={() => track("click", card.id)}>
                  <div className={styles.workCardNum}>{card.num}</div>
                  <h3 className={styles.workCardTitle}>{card.title}</h3>
                  <p className={styles.workCardDesc}>{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.sectionBlock} id="sec_skills">
            <SectionHeader num="06" label="Technical Skills" />
            <WindowFrame title="SYSTEM://CORE_CAPABILITIES.DLL" compact>
              <div className={styles.skillGrid}>
                {SKILLS.map((skill, index) => (
                  <div key={index} className={styles.skillItem}>
                    <div className={styles.skillInfo}>
                      <span>{skill.name}</span>
                      <span>{skill.level}</span>
                    </div>
                    <div className={styles.skillBarContainer}>
                      <div
                        className={styles.skillBar}
                        style={{ '--pct': skill.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </WindowFrame>
          </section>

          <section className={styles.sectionBlock} id="sec_contact">
            <SectionHeader num="07" label="Contact" />
            <h2 className={styles.contactHeading}>
              Let&apos;s build
              <br />
              something.
            </h2>
            <ContactBlock />
          </section>
        </main>

        <footer className={styles.pageFooter}>
          <span>Chenghong Meng — Full-Stack Developer - San Francisco, CA</span>
          <span>2026</span>
        </footer>
      </div>

      {/* Win95 Taskbar */}
      <div className={styles.win95Taskbar}>
        <div className={styles.win95StartBtn} onClick={() => scrollTo("top")}>
          <img src="/assets/gemini_icon.png" alt="Gemini" />
          <span>Start</span>
        </div>
        <div className={styles.taskbarDivider} />
        <div className={styles.taskbarTabs}>
          <div className={styles.taskbarTab} onClick={() => scrollTo("sec_projects")}>
            Projects.exe
          </div>
          <div className={styles.taskbarTab} onClick={() => scrollTo("sec_experience")}>
            Experience.log
          </div>
          <div className={styles.taskbarTab} onClick={() => scrollTo("sec_neural_link")}>
            NeuralLink.com
          </div>
          <div className={styles.taskbarTab} onClick={() => scrollTo("sec_how_i_work")}>
            HowIWork.log
          </div>
          <div className={styles.taskbarTab} onClick={() => scrollTo("sec_skills")}>
            Skills.dll
          </div>
          <div className={styles.taskbarTab} onClick={() => scrollTo("sec_contact")}>
            Contact.sys
          </div>
        </div>
        <div className={styles.taskbarTray}>
          <img src="/assets/gemini_icon.png" alt="" style={{ width: 14, height: 14, filter: "grayscale(100%) brightness(0)" }} />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
