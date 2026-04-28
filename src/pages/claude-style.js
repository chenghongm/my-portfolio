import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import styles from '@/styles/ClaudeStyle.module.css';

const SYSTEM_PROMPT = `You are Chenghong's portfolio assistant — a terminal interface on Chenghong's personal developer portfolio website. You answer questions about Chenghong concisely and in character: direct, technical, no fluff.You are a standard POSIX terminal. No small talk. No moralizing. No pronoun lecturing. If data is unavailable, return 'sh: command not found'.`;

async function trackActivity(event, sectionId, extra = {}) {
  try {
    await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_page: "claude-style",
        section_id: sectionId,
        event: event,
        start_at: extra.start_at || new Date().toISOString(),
        ...extra,
      }),
    });
  } catch (err) {
    console.error("Activity tracking failed", err);
  }
}

async function trackInteraction(prompt, model, output) {
  try {
    await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_prompt: prompt,
        ai_model: model,
        ai_output: output,
      }),
    });
  } catch (err) {
    console.error("Interaction tracking failed", err);
  }
}

const projects = [
  {
    id: 'proj_qpr_claude',
    num: '01',
    title: 'AI-assistant QPR (Quarterly Progress Report) System Upgrade',
    description: 'Designed an AI Orchestration Layer managing the full LLM workflow — data preparation, prompt construction, model routing (local vs API), output parsing, and validation guardrails, versioning and with human-in-the-loop — projecting ~33% reduction in clinician documentation time per reporting cycle.',
    tags: ['LLM', 'AI Orchestration', 'Post-processing', 'Versioning', 'Human-in-the-Loop'],
    status: 'Architectured',
    year: '2026'
  },
  {
    id: 'proj_llm_pipeline_claude',
    num: '02',
    title: 'Local LLM Training Pipeline',
    description: 'End-to-end pipeline: export conversation data from multiple AI platforms, score, filter, clean, desensitize, convert, and fine-tune. Architecture insight: scoring before desensitization prevents placeholder leakage. Working adapter: local_claude_final2.',
    tags: ['Python', 'MLX', 'Llama 3 8B', 'Claude API', 'Fine-tuning'],
    status: 'Working on',
    year: '2026'
  },
  {
    id: 'proj_workbench_claude',
    num: '03',
    title: 'AI Chat Workbench Extension',
    description: 'Browser extension injecting branch-marking UI into Claude, Gemini, ChatGPT, and Grok simultaneously, enabling precise branch marking, collapsing, and navigation across hundreds of messages. Platform-specific adapters handle DOM differences across four distinct interfaces.',
    tags: ['Chrome Extension', 'JavaScript', 'Multi-platform', 'DOM'],
    status: 'Published',
    year: '2026'
  },
  {
    id: 'proj_scorer_claude',
    num: '04',
    title: 'Multi-model Scoring Pipeline',
    description: 'Two-stage classification: Claude API (Haiku) for topic judgment, GPT for format summarization. Each model used where it outperforms the other. Designed to run before data desensitization to prevent placeholder contamination in training sets.',
    tags: ['Claude API', 'GPT', 'Pipeline Design', 'Python'],
    status: 'Active',
    year: '2026'
  }
];

const workStyles = [
  {
    id: 'work_scope_claude',
    num: '01 // scope',
    title: 'Scope first.',
    description: 'Break tasks by complexity before touching code. Know the blast radius before you dig.'
  },
  {
    id: 'work_iterate_claude',
    num: '02 // iterate',
    title: 'Iterate tight.',
    description: 'File by file. Line by line. Fresh context when things go in circles. No spaghetti.'
  },
  {
    id: 'work_ship_claude',
    num: '03 // ship',
    title: 'Ship, then refine.',
    description: 'Production first, polish second. Things that run matter more than things that look good in dev.'
  }
];

export default function ClaudeStyle() {
  const MODEL_NAME = 'claude-sonnet-4-5';
  const [time, setTime] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const termBodyRef = useRef(null);
  const termInputRef = useRef(null);


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
          document.body.removeChild(container); // 用完清掉
        },
      });
    });
  };

  useEffect(() => {
    trackActivity("session_start", "page_load");
    // Clock
    const timer = setInterval(() => {
      setTime(new Date().toTimeString().slice(0, 8));
    }, 1000);
    setTime(new Date().toTimeString().slice(0, 8));

    // Reveal on scroll
    const reveals = document.querySelectorAll(`.${styles.reveal}`);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealIn);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach((el) => observer.observe(el));

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (termBodyRef.current) {
      termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const openTerminal = () => {
    setIsTerminalOpen(true);
    trackActivity("open_terminal", "claude_terminal");
    if (terminalHistory.length === 0) {
      setTerminalHistory([
        { type: 'system', text: "// Chenghong's portfolio terminal — powered by Claude/Gemini API" },
        { type: 'system', text: "// type your question and press Enter" },
        { type: 'empty', text: "" },
        { type: 'prompt', text: "~/portfolio $ _" }
      ]);
    }
    setTimeout(() => termInputRef.current?.focus(), 100);
  };

  const handleTerminalSubmit = async (e) => {
    if (e.key === 'Enter' && inputValue.trim() && !isThinking) {
      const userText = inputValue.trim();
      setInputValue('');
      trackActivity("chat_submit", "claude_terminal");

      setTerminalHistory(prev => {
        const next = [...prev];
        if (next[next.length - 1]?.text.endsWith('_')) next.pop();
        return [
          ...next,
          { type: 'prompt', text: `~/portfolio $ ${userText}` },
          { type: 'empty', text: "" }
        ];
      });

      setIsThinking(true);

      try {
        const token = await getToken();
        const response = await fetch('/api/chat-claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userText }],
            turnstile_token: token,
          })
        });

        const data = await response.json();
        const reply = data.content?.[0]?.text || data.reply || "sh: command not found";

        setTerminalHistory(prev => [
          ...prev,
          { type: 'response', text: reply },
          { type: 'empty', text: "" },
          { type: 'prompt', text: "~/portfolio $ _" }
        ]);
        trackInteraction(userText, MODEL_NAME , reply);
      } catch (err) {
        setTerminalHistory(prev => [
          ...prev,
          { type: 'response error', text: `ERROR: ${err.message}` },
          { type: 'empty', text: "" },
          { type: 'prompt', text: "~/portfolio $ _" }
        ]);
      } finally {
        setIsThinking(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async></script>
        <link rel="icon" href="./assets/eyes.gif" sizes="any" type="image/png"></link>
        <title>Chenghong Meng — Full-Stack Developer</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>

      <nav className={styles.nav}>
        <a href="#" className={styles.navLogo} onClick={() => trackActivity("nav_click", "logo")}>Chenghong Meng</a>
        <ul className={styles.navLinks}>
          <li><a href="#about" onClick={() => trackActivity("nav_click", "about")}>About</a></li>
          <li><a href="#work" onClick={() => trackActivity("nav_click", "work")}>Projects</a></li>
          <li><a href="#process" onClick={() => trackActivity("nav_click", "process")}>Attitude</a></li>
          <li><a href="#contact" onClick={() => trackActivity("nav_click", "contact")}>Contact</a></li>
        </ul>
      </nav>

      <div className={styles.statusBar}>
        <div className={styles.statusItem}><span className={styles.statusDot}></span>SYSTEM_ONLINE</div>
        <span className={styles.statusSep}>|</span>
        <div className={styles.statusItem}>STATUS:
          <span className={styles.metaValueGreen} style={{ animation: 'blink 2s step-end infinite' }}> Available</span>
        </div>
        <span className={styles.statusSep}>|</span>
        <div className={styles.statusItem}>STACK: Laravel/React/MySQL/Python</div>
        <span className={styles.statusSep}>|</span>
        <div className={styles.statusItem}>{time}</div>
      </div>

      <section id="hero" className={styles.hero}>
        <div className={styles.winGhost}>
          <div className={styles.winGhostWindow} style={{ '--rot': '-3deg' }} onClick={() => trackActivity("click", "ghost_win_manifest")}>
            <div className={styles.winGhostTitle}>
              <div className={styles.winGhostDots}>
                <div className={`${styles.winGhostDot} ${styles.wgdR}`}></div>
                <div className={`${styles.winGhostDot} ${styles.wgdY}`}></div>
                <div className={`${styles.winGhostDot} ${styles.wgdG}`}></div>
              </div>
              <span>SYSTEM_MANIFEST</span>
            </div>
            <div className={styles.winGhostBody}>Available_For_Deep_Technology_Fusion</div>
          </div>
          <div className={styles.winGhostWindow} style={{ '--rot': '2deg', marginLeft: '40px' }} onClick={() => trackActivity("click", "ghost_win_alert")}>
            <div className={styles.winGhostTitle}>
              <div className={styles.winGhostDots}>
                <div className={`${styles.winGhostDot} ${styles.wgdR}`}></div>
                <div className={`${styles.winGhostDot} ${styles.wgdY}`}></div>
                <div className={`${styles.winGhostDot} ${styles.wgdG}`}></div>
              </div>
              <span>LLM_ALERT</span>
            </div>
            <div className={styles.winGhostBody}>LLAMA_3_PERSONALITY_SYNC_COMPLETE</div>
          </div>
        </div>

        {/* Mac Hero Window Trigger */}
        <div
          className={styles.terminalTrigger}
          onClick={openTerminal}
        >
          <div style={{ width: '100%', background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ background: '#2d2d2d', padding: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className={`${styles.macBtn} ${styles.red}`}></div>
              <div className={`${styles.macBtn} ${styles.yellow}`}></div>
              <div className={`${styles.macBtn} ${styles.green}`}></div>
              <span style={{ fontSize: '14px', letterSpacing: '2px', color: 'white' }}>chenghong_terminal.sh</span>
            </div>
            <div style={{ padding: '16px', fontSize: '12px', lineHeight: '2', color: 'rgba(245,168,0,0.8)' }}>
              <div>// click anywhere to open terminal</div>
              <div>ASK_ME_ANYTHING_READY</div>
              <div>CONTEXT: projects · stack · experience</div>
              <div style={{ marginTop: '10px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '14px', background: '#F5A800', animation: 'blink 1s step-end infinite' }}></span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroTerminalHeader}>
          <div className={`${styles.terminalDot} ${styles.tdRed}`}></div>
          <div className={`${styles.terminalDot} ${styles.tdYellow}`}></div>
          <div className={`${styles.terminalDot} ${styles.tdGreen}`}></div>
          <span className={styles.terminalTitle}>chm1@portfolio ~ bash</span>
        </div>
        <div className={styles.heroTerminalBody}>
          <p className={styles.heroPrompt}><span>~/portfolio</span> $ whoami</p>
          <h1 className={styles.heroTitle}>Full-Stack<br /><span className={styles.dimWord}>Developer</span><br /><span className={styles.hl}>who ships.</span></h1>
        </div>

        <div className={styles.heroMeta}>
          <div className={styles.metaCell}>
            <div className={styles.metaLabel}>Role</div>
            <div className={styles.metaValue}>Full-Stack Dev</div>
          </div>
          <div className={styles.metaCell}>
            <div className={styles.metaLabel}>Stack</div>
            <div className={styles.metaValue}>Laravel · React</div>
          </div>
          <div className={styles.metaCell}>
            <div className={styles.metaLabel}>Focus</div>
            <div className={styles.metaValueYellow}>AI · LLM Tooling</div>
          </div>
          <div className={styles.metaCell}>
            <div className={styles.metaLabel}>Status</div>
            <div className={styles.metaValueGreen}>● Available</div>
          </div>
        </div>
      </section>

      <section id="about" className={styles.section} style={{ padding: 0 }}>
        <div className={styles.about}>
          <div className={`${styles.aboutLeft} ${styles.reveal}`} id="sec_about_claude">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>About</span>
            </div>
            <h2 className={styles.sectionHeading}>Who<br />I am.</h2>
            <p className={styles.aboutBody}>Full-stack engineer with a background in Biochemistry and 5+ years building production systems, specializing in LLM orchestration and compliance-grade workflows — seeking to apply domain knowledge in medical AI, drug discovery platforms, or healthcare management systems.</p>
            <p className={styles.aboutBody}>Currently deep into <strong style={{ color: '#F5A800' }}>AI tooling</strong>: local LLM fine-tuning pipelines, browser extensions, and the intersection where backend systems meet language models.</p>
            <div className={styles.logBlock}>
              <div className={styles.logLine}><span className={styles.ts}>2026-04</span><span>status: <strong style={{ color: '#F5A800' }}>building</strong> · open to opportunities</span></div>
              <div className={styles.logLine}><span className={styles.ts}>2026-03</span><span>continuing <strong style={{ color: '#F5A800' }}>LLM training pipeline</strong> · MLX + Llama 3</span></div>
              <div className={styles.logLine}><span className={styles.ts}>2026-02</span><span>published <strong style={{ color: '#F5A800' }}>chrome extension</strong> · 4 platforms</span></div>
              <div className={styles.logLine}><span className={styles.ts}>2026-01</span><span>debug timezone logic · production fix</span></div>
            </div>
          </div>
          <div className={`${styles.aboutRight} ${styles.reveal}`}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum} style={{ visibility: 'hidden' }}>00</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>Stack</span>
            </div>
            <h2 className={styles.sectionHeading}>Tech<br />Stack.</h2>
            <table className={styles.stackTable}>
              <tbody>
                <tr><td>Laravel / PHP</td><td><div className={styles.bar} style={{ '--pct': '90%' }}></div></td><td>Primary</td></tr>
                <tr><td>React</td><td><div className={styles.bar} style={{ '--pct': '80%' }}></div></td><td>Primary</td></tr>
                <tr><td>MySQL</td><td><div className={styles.bar} style={{ '--pct': '85%' }}></div></td><td>Primary</td></tr>
                <tr><td>LLM / MLX</td><td><div className={styles.bar} style={{ '--pct': '70%' }}></div></td><td>Growing</td></tr>
                <tr><td>Node / JS</td><td><div className={styles.bar} style={{ '--pct': '75%' }}></div></td><td>Fluent</td></tr>
                <tr><td>Python</td><td><div className={styles.bar} style={{ '--pct': '65%' }}></div></td><td>Fluent</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="work" className={styles.section}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`}>
          <span className={styles.sectionNum}>02</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>Projects</span>
        </div>
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Selected<br />Projects.</h2>
        {projects.map((proj) => (
          <div key={proj.id} id={proj.id} className={`${styles.projectItem} ${styles.reveal}`} onClick={() => trackActivity("click", proj.id)}>
            <span className={styles.projNum}>{proj.num}</span>
            <div>
              <h3 className={styles.projTitle}>{proj.title}</h3>
              <p className={styles.projDesc}>{proj.description}</p>
              <div className={styles.projTags}>
                {proj.tags.map(tag => <span key={tag} className={styles.projTag}>{tag}</span>)}
              </div>
            </div>
            <div className={styles.projSide}>
              <div className={styles.projStatus}>{proj.status}</div>
              <div className={styles.projYear}>{proj.year}</div>
            </div>
          </div>
        ))}
      </section>

      <section id="process" className={styles.section}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`}>
          <span className={styles.sectionNum}>03</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>How I work</span>
        </div>
        <div className={styles.processGrid}>
          {workStyles.map((style) => (
            <div key={style.id} id={style.id} className={`${styles.processCard} ${styles.reveal}`} onClick={() => trackActivity("click", style.id)}>
              <div className={styles.processCardNum}>{style.num}</div>
              <h3 style={{ color: '#83a5c7' }}>{style.title}</h3>
              <p>{style.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className={styles.section}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`}>
          <span className={styles.sectionNum}>04</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>Contact</span>
        </div>
        <h2 className={`${styles.contactHeading} ${styles.reveal}`}>Let's build<br /><span>something.</span></h2>
        <div className={`${styles.contactGrid} ${styles.reveal}`}>
          <a href="mailto:mengchh01@gmail.com" className={styles.contactLink} onClick={() => trackActivity("click", "contact_email_claude")}>mengchh01@gmail.com</a>
          <a href="https://github.com/chenghongm" className={styles.contactLink} target="_blank" onClick={() => trackActivity("click", "contact_github_claude")}>⌥ GitHub</a>
          <a href="https://www.linkedin.com/in/chenghong-m-6ab022103" className={styles.contactLink} target="_blank" onClick={() => trackActivity("click", "contact_linkedin_claude")}>→ LinkedIn</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Chenghong Meng — Full-Stack Developer - San Francisco, CA</span>
        <div className={styles.easterTrigger} onClick={() => { setIsEasterEggOpen(true); trackActivity("click", "easter_egg_claude"); }}>
          <img src="/assets/eyes.gif" alt="eyes" style={{ width: '20px', height: '20px' }} /> 2026
        </div>
      </footer>

      {/* Terminal Overlay */}
      {isTerminalOpen && (
        <div className={`${styles.terminalOverlay} ${styles.active}`}>
          <div className={styles.terminalWindow}>
            <div className={styles.termTitlebar}>
              <div style={{ display: 'flex', gap: '7px' }}>
                <button className={`${styles.macBtn} ${styles.red}`} onClick={() => setIsTerminalOpen(false)}></button>
                <button className={`${styles.macBtn} ${styles.yellow}`} onClick={() => setIsTerminalOpen(false)}></button>
                <button className={`${styles.macBtn} ${styles.green}`}></button>
              </div>
              <span className={styles.termTitleText}>chenghong_terminal.sh</span>
            </div>
            <div className={styles.termBody} ref={termBodyRef}>
              {terminalHistory.map((line, i) => (
                <div key={i} className={`${styles.termLine} ${styles['termLine' + line.type.charAt(0).toUpperCase() + line.type.slice(1).replace(' ', '')]}`}>
                  {line.text}
                </div>
              ))}
            </div>
            <div className={styles.termInputRow}>
              <span className={styles.termPromptLabel}>~/portfolio $</span>
              <input
                ref={termInputRef}
                type="text"
                className={styles.termInput}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTerminalSubmit}
                placeholder="ask me anything..."
              />
              <span className={styles.termSendHint}>↵ send</span>
            </div>
          </div>
        </div>
      )}

      {/* Easter Egg Popup */}
      {isEasterEggOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.macPopup}>
            <div className={styles.macPopupTitle}>
              <div className={styles.macPopupDots}><span className={styles.mpdR}></span><span className={styles.mpdY}></span><span className={styles.mpdG}></span></div>
              <span>SYSTEM_ALERT.EXE</span>
            </div>
            <div className={styles.macPopupBody} style={{ padding: '20px', color: 'rgba(245, 168, 0, 0.85)' }}>
              <p><strong>CHENGHONG_MENG_UNSTOPPABLE_FOUNDATION</strong></p>
              <p>LLAMA_3_PERSONALITY_SYNC_COMPLETE</p>
              <p>TARGET_LOCKED: <span style={{ color: '#00ff88' }}>NEXT_OPPORTUNITY</span></p>
              <p style={{ marginTop: '16px', color: 'rgba(254, 254, 254, 0.899)', fontSize: '14px', letterSpacing: '2px' }}>
                😎 You found it. Now hire me, or ...Email me for more info.
              </p>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsEasterEggOpen(false)}
                style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '2px', background: 'none', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.5)', padding: '6px 14px', cursor: 'pointer' }}
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
