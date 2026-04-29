import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Script from "next/script";
import styles from '@/styles/ClaudeStyle.module.css';
import { 
  trackActivity, 
  trackInteraction, 
  PROJECTS, 
  WORK_CARDS, 
  SYSTEM_PROMPTS, 
  TERMINALS,
  CONTACT_INFO,
  HERO_INFO,
  SKILLS
} from '../lib/sharedfunctions';

export default function ClaudeStyle() {
  const PAGE_ID = 'claude-style';
  const MODEL_NAME = 'claude-sonnet-4-5';
  
  // Wrap trackActivity for convenience
  const track = (event, sectionId, extra) => trackActivity(PAGE_ID, event, sectionId, extra);

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
    track("session_start", "page_load");
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
  }, [terminalHistory, isThinking]);

  const openTerminal = () => {
    setIsTerminalOpen(true);
    track("open_terminal", "claude_terminal");
    if (terminalHistory.length === 0) {
      setTerminalHistory([
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
      track("chat_submit", "claude_terminal");

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
            system: SYSTEM_PROMPTS.CLAUDE,
            model: MODEL_NAME,
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
        trackInteraction(userText, MODEL_NAME, reply);
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
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <Head>
        {/* <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async></script> */}
        <link rel="icon" href="./assets/eyes.gif" sizes="any" type="image/png"></link>
        <title>Chenghong Meng — Full-Stack Developer</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      
      <nav className={styles.nav}>
        <a href="#" className={styles.navLogo} onClick={() => track("nav_click", "logo")}>Chenghong Meng</a>
        <ul className={styles.navLinks}>
          <li><a href="#about" onClick={() => track("nav_click", "about")}>About</a></li>
          <li><a href="#work" onClick={() => track("nav_click", "work")}>Projects</a></li>
          <li><a href="#process" onClick={() => track("nav_click", "process")}>Attitude</a></li>
          <li><a href="#contact" onClick={() => track("nav_click", "contact")}>Contact</a></li>
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
          <div className={styles.winGhostWindow} style={{ '--rot': '-3deg' }} onClick={() => track("click", "ghost_win_manifest")}>
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
          <div className={styles.winGhostWindow} style={{ '--rot': '2deg', marginLeft: '40px' }} onClick={() => track("click", "ghost_win_alert")}>
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
          {HERO_INFO.meta.slice(0, 4).map((m, i) => (
            <div key={i} className={styles.metaCell}>
              <div className={styles.metaLabel}>{m.label}</div>
              <div className={m.status ? styles.metaValueGreen : (m.label === 'FOCUS' ? styles.metaValueYellow : styles.metaValue)}>{m.value}</div>
            </div>
          ))}
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
                {SKILLS.map((skill, index) => (
                  <tr key={index}>
                    <td>{skill.name}</td>
                    <td><div className={styles.bar} style={{ '--pct': skill.pct }}></div></td>
                    <td>{skill.level}</td>
                  </tr>
                ))}
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
        {PROJECTS.map((proj) => (
          <div key={proj.id} id={proj.id} className={`${styles.projectItem} ${styles.reveal}`} onClick={() => track("click", proj.id)}>
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
          {WORK_CARDS.map((style) => (
            <div key={style.id} id={style.id} className={`${styles.processCard} ${styles.reveal}`} onClick={() => track("click", style.id)}>
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
          {CONTACT_INFO.map((info) => (
            <a 
              key={info.id} 
              href={info.href} 
              className={styles.contactLink} 
              target={info.href.startsWith('http') ? "_blank" : undefined}
              onClick={() => track("click", `${info.id}_claude`)}
            >
              {info.icon && <span>{info.icon} </span>}{info.label}
            </a>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Chenghong Meng — Full-Stack Developer - San Francisco, CA</span>
        <div className={styles.easterTrigger} onClick={() => { setIsEasterEggOpen(true); track("click", "easter_egg_claude"); }}>
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
            <div className='p-2'>
              <p className='text-yellow-500 text-xs'><b>NOTE:</b> {TERMINALS.CLAUDE.alert}</p>
            </div>
            <div className={styles.termBody} ref={termBodyRef}>
              {terminalHistory.map((line, i) => (
                <div key={i} className={`${styles.termLine} ${styles['termLine' + line.type.charAt(0).toUpperCase() + line.type.slice(1).replace(' ', '')]}`}>
                  {line.text}
                </div>
              ))}
              {isThinking && (
                <div className={styles.thinkingLine}>
                  Thinking<span>.</span><span>.</span><span>.</span>
                </div>
              )}
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
