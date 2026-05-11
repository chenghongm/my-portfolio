import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Script from "next/script";
import styles from '@/styles/ClaudeStyle.module.css';
import {
  trackActivity,
  trackInteraction,
  PROJECTS,
  EXPERIENCES,
  WORK_CARDS,
  SYSTEM_PROMPTS,
  buildSystemPrompt,
  JOB_SEARCH_IFRAMES,
  TERMINALS,
  CONTACT_INFO,
  HERO_INFO,
  SKILLS,
  INITIAL_PROMPT_HOOKS,
  getFollowupHooks
} from '../lib/sharedfunctions';

export default function ClaudeStyle() {
  const PAGE_ID = 'claude-style';
  const MODEL_NAME = 'claude-sonnet-4-5';
  const PROMPT_CHAR_LIMIT = 300;
  const INITIAL_TERMINAL_LINES = [
    // { type: 'system', text: "// type your question and press Enter" },
    { type: 'empty', text: "" },
    { type: 'prompt', text: "~/portfolio $ _" }
  ];

  // Wrap trackActivity for convenience
  const track = (event, sectionId, extra) => trackActivity(PAGE_ID, event, sectionId, extra);

  const [time, setTime] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [visibleHooks, setVisibleHooks] = useState(INITIAL_PROMPT_HOOKS);
  const [activeJobTab, setActiveJobTab] = useState(0);
  const [jobSearchIframes, setJobSearchIframes] = useState(JOB_SEARCH_IFRAMES);

  
  const termBodyRef = useRef(null);
  const termInputRef = useRef(null);
  
  // Ref to track if the user has manually scrolled up
  const userScrolledRef = useRef(false);

  // Track if terminal was intentionally opened by user to prevent scroll-auto-collapse
  const isManuallyOpenedRef = useRef(false);

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

  // Handle Terminal Scroll Tracking
  useEffect(() => {
    const handleTerminalScroll = () => {
      if (!termBodyRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = termBodyRef.current;
      // If we are significantly above the bottom, consider it a user scroll
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 30;
      
      if (!isAtBottom) {
        userScrolledRef.current = true;
      }
    };

    const termBody = termBodyRef.current;
    if (termBody) {
      termBody.addEventListener('scroll', handleTerminalScroll);
    }

    return () => {
      if (termBody) {
        termBody.removeEventListener('scroll', handleTerminalScroll);
      }
    };
  }, [isTerminalOpen]);

  // Handle Auto-Scrolling Behavior
  useEffect(() => {
    if (termBodyRef.current && !userScrolledRef.current) {
      const promptElements = termBodyRef.current.querySelectorAll(`.${styles.termLinePrompt}`);
      // Find the most recent actual prompt (not the trailing empty one if we aren't thinking)
      let targetPrompt = null;
      
      if (isThinking && promptElements.length > 0) {
          // If thinking, the last prompt is the one we want to stick to the top
          targetPrompt = promptElements[promptElements.length - 1];
      } else if (!isThinking && promptElements.length > 1) {
          // If done, the second to last prompt is the user's question, the last is the empty `_`
          targetPrompt = promptElements[promptElements.length - 2];
      }

      if (targetPrompt) {
        // Scroll so the prompt is at the top with a tiny bit of padding
        termBodyRef.current.scrollTo({
          top: Math.max(0, targetPrompt.offsetTop - 10),
          behavior: 'smooth'
        });
      } else {
        // Fallback to bottom
        termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight;
      }
    }
  }, [terminalHistory, isThinking]);

  useEffect(() => {
    const handlePageScroll = () => {
      const scrollTop = window.scrollY;
      
      if (scrollTop < 200) {
        // Reset manual open flag when returning to top
        isManuallyOpenedRef.current = false;
        return;
      }

      // Only auto-collapse if we scroll past 200 AND it wasn't manually opened
      if (scrollTop > 200 && !isTerminalCollapsed && !isTerminalMaximized && !isManuallyOpenedRef.current) {
        setIsTerminalOpen(false);
        setIsTerminalCollapsed(true);
        setIsTerminalMaximized(false);
      }
    };

    window.addEventListener('scroll', handlePageScroll, { passive: true });
    // Don't auto-run on mount to prevent instant collapse if refreshing halfway down

    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, [isTerminalCollapsed, isTerminalMaximized]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openTerminal = () => {
    isManuallyOpenedRef.current = true;
    userScrolledRef.current = false;
    setIsTerminalOpen(true);
    setIsTerminalCollapsed(false);
    // On small screens, directly open maximized
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsTerminalMaximized(true);
    }
    track("open_terminal", "claude_terminal");
    if (terminalHistory.length === 0) {
      setTerminalHistory(INITIAL_TERMINAL_LINES);
    }
    setTimeout(() => termInputRef.current?.focus(), 100);
  };

  const collapseTerminal = () => {
    setIsTerminalOpen(false);
    setIsTerminalCollapsed(true);
    setIsTerminalMaximized(false);
    isManuallyOpenedRef.current = false;

    track("collapse_terminal", "claude_terminal");
  };

  const expandCollapsedTerminal = () => {
    isManuallyOpenedRef.current = true;
    userScrolledRef.current = false;
    setIsTerminalOpen(true);
    setIsTerminalCollapsed(false);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsTerminalMaximized(true);
    }
    track("expand_terminal", "claude_terminal");
    setTimeout(() => termInputRef.current?.focus(), 100);
  };

  const toggleTerminalMaximized = () => {
    isManuallyOpenedRef.current = true;
    userScrolledRef.current = false;
    setIsTerminalOpen(true);
    setIsTerminalCollapsed(false);
    setIsTerminalMaximized((prev) => !prev);
    track("toggle_maximize_terminal", "claude_terminal", { next_state: !isTerminalMaximized ? "maximized" : "windowed" });
    setTimeout(() => termInputRef.current?.focus(), 100);
  };

  const handleCollapseButtonClick = (event, buttonType) => {

    event.stopPropagation();
    collapseTerminal();
  };

  const handleMaximizeButtonClick = (event, buttonType) => {

    event.stopPropagation();
    toggleTerminalMaximized();
  };

  const submitPrompt = async (rawPrompt, source = 'typed', hookType = null) => {
    const userText = rawPrompt.trim();
    if (!userText || isThinking) return;
    
    userScrolledRef.current = false;

    if (userText.length > PROMPT_CHAR_LIMIT) {
      setTerminalHistory(prev => {
        const seeded = prev.length ? [...prev] : [...INITIAL_TERMINAL_LINES];
        if (seeded[seeded.length - 1]?.text.endsWith('_')) seeded.pop();
        return [
          ...seeded,
          { type: 'response error', text: `ERROR: Prompt limit is ${PROMPT_CHAR_LIMIT} characters.` },
          { type: 'empty', text: "" },
          { type: 'prompt', text: "~/portfolio $ _" }
        ];
      });
      setVisibleHooks(getFollowupHooks(userText));
      return;
    }

    setInputValue('');
    if (source === 'hook') {
      track("hook_click", "claude_terminal", { hook_type: hookType, prompt_text: userText });
    } else {
      track("chat_submit", "claude_terminal");
    }

    const updatedChatHistory = [...chatHistory, { role: 'user', content: userText }];
    setChatHistory(updatedChatHistory);
    setTerminalHistory(prev => {
      const seeded = prev.length ? [...prev] : [...INITIAL_TERMINAL_LINES];
      if (seeded[seeded.length - 1]?.text.endsWith('_')) seeded.pop();
      return [
        ...seeded,
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
          system: buildSystemPrompt(SYSTEM_PROMPTS.CLAUDE, updatedChatHistory),
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
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      trackInteraction(userText, MODEL_NAME, reply);
    } catch (err) {
      setTerminalHistory(prev => [
        ...prev,
        { type: 'response error', text: `ERROR: ${err.message}` },
        { type: 'empty', text: "" },
        { type: 'prompt', text: "~/portfolio $ _" }
      ]);
    } finally {
      setVisibleHooks(getFollowupHooks(userText));
      setIsThinking(false);
    }
  };

  const handleTerminalSubmit = async (e) => {
    if (e.key === 'Enter') {
      await submitPrompt(inputValue, 'typed');
    }
  };

  const handleHookClick = async (prompt, hookType = 'followup_hook') => {
    if (isThinking) return;
    if (!isTerminalOpen) {
      isManuallyOpenedRef.current = true;
      setIsTerminalOpen(true);
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsTerminalMaximized(true);
      }
    }
    setIsTerminalCollapsed(false);
    if (terminalHistory.length === 0) {
      setTerminalHistory(INITIAL_TERMINAL_LINES);
    }
    setTimeout(() => termInputRef.current?.focus(), 100);
    await submitPrompt(prompt, 'hook', hookType);
  };

  const renderHooks = (hookType, compact = false) => (
    <div className={`${styles.promptHookGroup} ${compact ? styles.promptHookGroupCompact : ''}`}>
      {visibleHooks.map((hook) => (
        <button
          key={hook}
          type="button"
          className={styles.promptHook}
          disabled={isThinking}
          onClick={(event) => {
            event.stopPropagation();
            handleHookClick(hook, hookType);
          }}
        >
          {hook}
        </button>
      ))}
    </div>
  );

  const renderProjectRepoLink = (proj) => {
    const hasPublicRepo = proj.github && proj.github !== '#';

    if (!hasPublicRepo) {
      return (
        <span className={`${styles.projLink} ${styles.projLinkPrivate}`} title="Private Repository">
          Private Repository
        </span>
      );
    }

    return (
      <a
        href={proj.github}
        title="View on GitHub"
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          e.stopPropagation();
          track("click", `${proj.id}_link`);
        }}
        className={styles.projLink}
      >
        View on GitHub
      </a>
    );
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
        <div className={styles.navActions}>
          <ul className={`${styles.navLinks} ${isMobileNavOpen ? styles.navLinksOpen : ''}`}>
            <li><a href="#about" onClick={() => { setIsMobileNavOpen(false); track("nav_click", "about"); }}>About</a></li>
            <li><a href="#experience" onClick={() => { setIsMobileNavOpen(false); track("nav_click", "experience"); }}>Experience</a></li>
            <li><a href="#work" onClick={() => { setIsMobileNavOpen(false); track("nav_click", "work"); }}>Projects</a></li>
            <li><a href="#job-search" onClick={() => { setIsMobileNavOpen(false); track("nav_click", "job-search"); }}>Job Search</a></li>
            <li><a href="#process" onClick={() => { setIsMobileNavOpen(false); track("nav_click", "process"); }}>Attitude</a></li>
            <li><a href="#contact" onClick={() => { setIsMobileNavOpen(false); track("nav_click", "contact"); }}>Contact</a></li>
          </ul>
          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.navMenuToggle}
              aria-label="Toggle routes"
              title="Toggle routes"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>
        </div>
         <div className={styles.navActions}>
           <a href="#" className={styles.navLogo} onClick={() => track("nav_click", "logo")}>Chenghong Meng</a>
          <a
            href="/gemini-style"
            className={styles.themeSwitch}
            onClick={() => track("nav_click", "switch_to_gemini")}
            aria-label="Switch to Gemini style"
            title="Switch to Gemini style"
          >
            <span className={styles.themeSwitchIcon} aria-hidden="true">
              <img className={styles.themeSwitchHalfLeft} src="/assets/claude-ai-logo.svg" alt="" />
              <img className={styles.themeSwitchHalfRight} src="/assets/gemini_icon.png" alt="" />
            </span>
          </a>
         
        </div>
      </nav>

      <div className={styles.statusBar}>
        <div className={styles.statusItem}><span className={styles.statusDot}></span>SYSTEM_ONLINE</div>
        <span className={styles.statusSep}>|</span>
        <div className={styles.statusItem}>STATUS:
          <span className={styles.metaValueGreen} style={{ animation: 'blink 2s step-end infinite' }}> Listening</span>
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
            <div className={styles.winGhostBody}>Listening_For_Deep_Technology_Fusion</div>
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
        {!isTerminalOpen && !isTerminalCollapsed && (
          <div
            className={styles.terminalTrigger}
            onClick={openTerminal}
          >
            <div style={{ width: '100%', background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ background: '#2d2d2d', padding: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className={`${styles.macBtn} ${styles.red}`} onClick={(e) => handleCollapseButtonClick(e, 'close')}></div>
                <div className={`${styles.macBtn} ${styles.yellow}`} onClick={(e) => handleCollapseButtonClick(e, 'minimize')}></div>
                <div className={`${styles.macBtn} ${styles.green}`} onClick={(e) => handleMaximizeButtonClick(e, 'maximize')}></div>
                <span style={{ fontSize: '14px', letterSpacing: '2px', color: 'white' }}>chenghong_terminal.sh</span>
              </div>
              <div style={{ padding: '16px', fontSize: '12px', lineHeight: '2', color: 'rgba(245,168,0,0.8)' }}>
                <div>{'// click anywhere to open terminal'}</div>
                <div>CONTEXT: projects · stack · experience</div>
                <div className={styles.triggerHookWrap}>
                  {renderHooks(chatHistory.length === 0 ? 'initial_hook' : 'followup_hook', true)}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '14px', background: '#F5A800', animation: 'blink 1s step-end infinite' }}></span>
                  <div className={styles.askMeAnything}>ASK_ME_ANYTHING_READY</div>
                </div>
              </div>
            </div>
          </div>
        )}

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
              <div className={styles.logLine}><span className={styles.ts}>2026-05</span><span>continue: <strong style={{ color: '#F5A800' }}>building</strong> · daily job search eval tool</span></div>
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

      <section id="experience" className={styles.section}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`}>
          <span className={styles.sectionNum}>02</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>Experience</span>
        </div>
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Work<br />Experience.</h2>
        {EXPERIENCES.map((exp) => (
          <div key={exp.id} id={exp.id} className={`${styles.expItem} ${styles.reveal}`} onClick={() => track("click", exp.id)}>
            <div className={styles.expWindowHeader}>
              <div className={styles.expWindowDots}>
                <div className={`${styles.macBtn} ${styles.red}`}></div>
                <div className={`${styles.macBtn} ${styles.yellow}`}></div>
                <div className={`${styles.macBtn} ${styles.green}`}></div>
              </div>
              <div className={styles.expStatus}>{exp.status}</div>
            </div>
            <div className={styles.expWindowBody}>
              <div className={styles.expHeader}>
                <h3 className={styles.expTitle}>{exp.title}</h3>
                <span className={styles.expDate}>{exp.dateRange}</span>

              </div>
              <p className={styles.expScope}>{exp.scope}</p>
              <div className={styles.projTags} style={{ marginTop: '10px', marginBottom: '10px' }}>
                {exp.tags?.map(tag => <span key={tag} className={styles.projTag}>{tag}</span>)}
              </div>
              {exp.projects && exp.projects.length > 0 && (
                <div className={styles.expProjects}>
                  {exp.projects.map(p => (
                    <div key={p.id} id={p.id} className={styles.expProjCard} onClick={(e) => { e.stopPropagation(); track("click", p.id); }}>
                      <h4 className={styles.expProjTitle}>{p.title}</h4>
                      <small className={styles.expProjStatus}>{p.status}</small>
                      <p className={styles.expProjYear}>{p.year}</p>
                      <p className={styles.expProjDesc}>{p.description}</p>
                      <div className={styles.projTags}>
                        {p.tags.map(tag => <span key={tag} className={styles.projTag}>{tag}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      <section id="work" className={styles.section}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`}>
          <span className={styles.sectionNum}>03</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>Projects</span>
        </div>
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Selected<br />Projects.</h2>
        {PROJECTS.map((proj) => (
          <div key={proj.id} id={proj.id} className={`${styles.projectItem} ${styles.reveal}`} onClick={() => track("click", proj.id)}>
            <span className={styles.projNum}>{proj.num}</span>
            <div className={styles.projContent}>
              <h3 className={styles.projTitle}>{proj.title}</h3>
              <p className={styles.projDesc}>{proj.description}</p>
              <div className={styles.projTags}>
                {proj.tags.map(tag => <span key={tag} className={styles.projTag}>{tag}</span>)}
              </div>
            </div>
            <div className={styles.projSide}>
              <div className={styles.projStatus}>{proj.status}</div>
              <div className={styles.projYear}>{proj.year}</div>
              <div className={styles.projLinkRow}>
                {renderProjectRepoLink(proj)}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section id="process" className={styles.section}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`}>
          <span className={styles.sectionNum}>04</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>How I work</span>
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

      <section id="job-search" className={styles.section}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`}>
          <span className={styles.sectionNum}>05</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>Daily Activity</span>
        </div>
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Job Search<br />Results.</h2>

        <small className={`${styles.sectionSubheading} ${styles.reveal}`}>
            Data from top job search platforms, updated daily via automated scraping and LLM parsing pipelines. The main purpose of this comparison is to demonstrate LLM has their own unique "personality" in how they gradient and score a job relevance, and has its own tech bias and ranking algorithms, so by leveraging multiple sources and LLMs, job seekers can get a more holistic view of the market and uncover hidden gems that may not appear on traditional job boards. :)
        </small>
        
        <div className={`${styles.tabGroup} ${styles.reveal}`}>
          {jobSearchIframes.map((iframe, index) => (
            <button
              key={index}
              className={`${styles.tabButton} ${activeJobTab === index ? styles.tabActive : ''}`}
              onClick={() => { setActiveJobTab(index); track("click", `job_tab_${index}`); }}
            >
              {iframe.title}
            </button>
          ))}
        </div>

        <div className={`${styles.iframeContainer} ${styles.reveal}`}>
          <iframe 
            src={jobSearchIframes[activeJobTab].src} 
            width="100%" 
            height="500"
            title={jobSearchIframes[activeJobTab].title}
          ></iframe>
        </div>
      </section>

      <section id="contact" className={styles.section}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`}>
          <span className={styles.sectionNum}>06</span><span className={styles.sectionLine}></span><span className={styles.sectionLabel}>Contact</span>
        </div>
        <h2 className={`${styles.contactHeading} ${styles.reveal}`}>Let&apos;s build<br /><span>something.</span></h2>
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
        <div className={`${styles.terminalOverlay} ${styles.active} ${isTerminalMaximized ? styles.maximized : ''}`}>
          <div className={styles.terminalWindow}>
            <div className={styles.termTitlebar}>
              <div style={{ display: 'flex', gap: '7px' }}>
                <button
                  className={`${styles.macBtn} ${styles.red} ${styles.macBtnLarge}`}
                  onClick={(e) => handleCollapseButtonClick(e, 'close')}
                  aria-label="Close"
                  data-tooltip="Close"
                ></button>
                <button
                  className={`${styles.macBtn} ${styles.yellow} ${styles.macBtnLarge}`}
                  onClick={(e) => handleCollapseButtonClick(e, 'minimize')}
                  aria-label="Minimize"
                  data-tooltip="Minimize"
                ></button>
                <button
                  className={`${styles.macBtn} ${styles.green}`}
                  onClick={(e) => handleMaximizeButtonClick(e, 'maximize')}
                  aria-label={isTerminalMaximized ? 'Restore' : 'Maximize'}
                  data-tooltip={isTerminalMaximized ? 'Restore' : 'Maximize'}
                ></button>
              </div>
              <span className={styles.termTitleText}>chenghong_terminal.sh</span>
            </div>
            <div className={`${styles.termMeta} p-2`}>
              <p className='text-yellow-500 text-xs'><b>NOTE:</b> {TERMINALS.CLAUDE.alert}</p>
              {/* <p className='text-yellow-500 text-xs'><b>LIMIT:</b> Ask one prompt at a time, up to {PROMPT_CHAR_LIMIT} characters.</p> */}
            </div>
            <div className={styles.termBody} ref={termBodyRef}>
              {terminalHistory.map((line, i) => (
                <div key={i} className={`${styles.termLine} ${styles['termLine' + line.type.charAt(0).toUpperCase() + line.type.slice(1).replace(' ', '')]}`}>
                  {line.text}
                </div>
              ))}
              {renderHooks(chatHistory.length === 0 ? 'initial_hook' : 'followup_hook')}
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
                onChange={(e) => setInputValue(e.target.value.slice(0, PROMPT_CHAR_LIMIT))}
                onKeyDown={handleTerminalSubmit}
                placeholder="ask me anything..."
                maxLength={PROMPT_CHAR_LIMIT}
              />
              <span className={styles.termCharCount}>{inputValue.length}/{PROMPT_CHAR_LIMIT}</span>
              <button
                type="button"
                className={styles.termSendBtn}
                onClick={() => submitPrompt(inputValue, 'typed')}
                disabled={!inputValue.trim() || isThinking}
                aria-label="Send prompt"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      )}

      {isTerminalCollapsed && (
        <button
          type="button"
          className={styles.collapsedBubble}
          onClick={expandCollapsedTerminal}
          aria-label="Open terminal chat"
        >
          <span className={styles.collapsedBubbleIcon} aria-hidden="true">
            <span className={styles.collapsedBubbleDots}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </span>
        </button>
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
                😎 You found it. Now hire me, or Email me for more info, thanks!
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
