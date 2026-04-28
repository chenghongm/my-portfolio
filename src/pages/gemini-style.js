import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import styles from "../styles/GeminiStyle.module.css";
import { 
  trackActivity, 
  trackInteraction, 
  PROJECTS, 
  WORK_CARDS, 
  SYSTEM_PROMPTS, 
  CONTACT_INFO,
  HERO_INFO
} from '../lib/sharedfunctions';

const PAGE_ID = 'gemini-style';

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
  const [time, setTime] = useState("");
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

  const handleSubmit = async (e) => {
    if (e.key === "Enter" && input.trim() && !isThinking) {
      const userMsg = input.trim();
      setInput("");
      setHistory((prev) => [...prev, { role: "user", content: userMsg }]);
      setIsThinking(true);
      track("chat_submit", "gemini_terminal");

      try {
        const token = await getToken();
        const response = await fetch("/api/chat-gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: SYSTEM_PROMPTS.GEMINI,
            messages: [{ role: "user", content: userMsg }],
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
        setIsThinking(false);
      }
    }
  };

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
              <pre className={styles.heroArt} aria-hidden="true">{HERO_INFO.art}</pre>
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

          {/* Neural Link Terminal */}
          <section className={styles.sectionBlock} id="sec_neural_link">
            <SectionHeader num="03" label="Neural Link" />
            <div className={`${styles.terminalWindow} win95-inset`}>
              <div className={styles.win95Header} style={{ marginBottom: 0 }}>
                <span>📡 REMOTE_NEURAL_LINK.EXE (GEMINI_DIRECT)</span>
              </div>
              <div className={styles.terminalBody} ref={terminalBodyRef}>
                <div className={styles.terminalLineAi}>[SYSTEM]: NEURAL LINK ESTABLISHED. POWERED BY GEMINI PRO.</div>
                {history.map((msg, i) => (
                  <div key={i} className={msg.role === "user" ? styles.terminalLineUser : styles.terminalLineAi}>
                    {msg.role === "user" ? `> ${msg.content}` : msg.content}
                  </div>
                ))}
                {isThinking && <div className="animate-pulse">THINKING...</div>}
              </div>
              <div className={styles.terminalInputArea}>
                <span className={styles.terminalPrompt}>&gt;</span>
                <input
                  type="text"
                  className={styles.terminalInput}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleSubmit}
                  placeholder="Ask about my projects..."
                />
              </div>
            </div>
          </section>

          <section className={styles.sectionBlock} id="sec_how_i_work">
            <SectionHeader num="04" label="How I work" />
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

          <section className={styles.sectionBlock} id="sec_contact">
            <SectionHeader num="05" label="Contact" />
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
          <div className={styles.taskbarTab} onClick={() => scrollTo("sec_neural_link")}>
            NeuralLink.com
          </div>
          <div className={styles.taskbarTab} onClick={() => scrollTo("sec_how_i_work")}>
            HowIWork.log
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
