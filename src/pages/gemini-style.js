import Head from "next/head";
import { useState, useRef, useEffect } from "react";

const projects = [
  {
    id: "proj_qpr",
    num: "01",
    windowTitle: "APP://QPR_SYSTEM_UPGRADE.EXE",
    title: "AI-assistant QPR (Quarterly Progress Report) System Upgrade",
    description:
      "Designed an AI orchestration layer managing the full LLM workflow: data preparation, prompt construction, model routing, output parsing, validation guardrails, versioning, and human-in-the-loop review. Targeted a projected ~33% reduction in clinician documentation time per reporting cycle.",
    tags: ["LLM", "AI Orchestration", "Post-processing", "Versioning", "Human-in-the-Loop"],
    status: "Architectured",
    year: "2026",
  },
  {
    id: "proj_llm_pipeline",
    num: "02",
    windowTitle: "ML://LOCAL_LLM_PIPELINE.SH",
    title: "Local LLM Training Pipeline",
    description:
      "Built an end-to-end pipeline to export conversation data from multiple AI platforms, score, filter, clean, desensitize, convert, and fine-tune. The key architectural insight is to score before desensitization to avoid placeholder leakage in training data.",
    tags: ["Python", "MLX", "Llama 3 8B", "Claude API", "Fine-tuning"],
    status: "Working on",
    year: "2026",
  },
  {
    id: "proj_workbench",
    num: "03",
    windowTitle: "APP://AI_CHAT_WORKBENCH.EXE",
    title: "AI Chat Workbench Extension",
    description:
      "Browser extension that injects branch-marking UI into Claude, Gemini, ChatGPT, and Grok at once, enabling precise branch marking, collapsing, and navigation across long conversations. Platform-specific adapters handle DOM differences across interfaces.",
    tags: ["Chrome Extension", "JavaScript", "Multi-platform", "DOM"],
    status: "Published on GitHub",
    year: "2026",
  },
  {
    id: "proj_scorer",
    num: "04",
    windowTitle: "ML://MULTI_MODEL_SCORER.SH",
    title: "Multi-model Scoring Pipeline",
    description:
      "Two-stage classification pipeline: Claude API (Haiku) for topic judgment and GPT for format summarization. Each model is used where it performs best, and the flow runs before desensitization to avoid placeholder contamination in training sets.",
    tags: ["Claude API", "GPT", "Pipeline Design", "Python"],
    status: "Active",
    year: "2026",
  },
];

const workCards = [
  {
    id: "work_scope",
    num: "01 // scope",
    title: "Scope first.",
    description:
      "Break tasks by complexity before touching code. Know the blast radius before you dig.",
  },
  {
    id: "work_iterate",
    num: "02 // iterate",
    title: "Iterate tight.",
    description:
      "File by file. Line by line. Fresh context when things go in circles. No spaghetti.",
  },
  {
    id: "work_ship",
    num: "03 // ship",
    title: "Ship, then refine.",
    description:
      "Production first, polish second. Things that run matter more than things that look good in dev.",
  },
];

const SYSTEM_PROMPT = `You are Chenghong's portfolio assistant (Gemini Edition). You help visitors understand Chenghong's work. Answer concisely and professionally. Focus on Backend, LLMs, and System Architecture.`;

async function trackActivity(event, sectionId, extra = {}) {

  try {
    await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_page: "gemini-style",
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

function SectionHeader({ num, label }) {
  return (
    <div className="section-header">
      <span className="section-num">{num}</span>
      <span className="section-line" />
      <span className="section-label">{label}</span>
    </div>
  );
}

function WindowFrame({ title, children, id, className = "", compact = false }) {
  return (
    <section id={id} className={`win95-window ${className}`} onClick={() => id && trackActivity("click", id)}>
      <div className="win95-header">
        <span>{title}</span>
        <div className="win95-controls" aria-hidden="true">
          <span className="win95-btn">
            <span className="icon-min" />
          </span>
          <span className="win95-btn">
            <span className="icon-max" />
          </span>
          <span className="win95-btn">
            <span className="icon-close">×</span>
          </span>
        </div>
      </div>
      <div className={compact ? "win95-body compact" : "win95-body"}>{children}</div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <WindowFrame
      id={project.id}
      title={project.windowTitle}
      className={`project-window ${project.num === "01" || project.num === "04" ? "project-window-wide" : ""}`}
      compact
    >
      <div className="project-panel win95-inset">
        <div className="project-card-top">
          <div>
            <div className="project-id">{project.num}</div>
            <h3 className="project-title">{project.title}</h3>
          </div>
          <div className="project-side">
            <div className="project-status">{project.status}</div>
            <div className="project-year">{project.year}</div>
          </div>
        </div>
        <p className="project-desc">{project.description}</p>
        <div className="project-tags" aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">
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
    <WindowFrame id="contact_block" title="CONTACT://CHANNELS.SYS" className="contact-window" compact>
      <div className="contact-grid">
        <a className="contact-link" href="mailto:mengchh01@gmail.com" onClick={() => trackActivity("click", "contact_email")}>
          mengchh01@gmail.com
        </a>
        <a
          className="contact-link"
          href="https://github.com/chenghongm"
          target="_blank"
          rel="noreferrer"
          onClick={() => trackActivity("click", "contact_github")}
        >
          ⌥ GitHub
        </a>
        <a className="contact-link" href="https://www.linkedin.com/in/chenghong-m-6ab022103" onClick={() => trackActivity("click", "contact_linkedin")}>
          → LinkedIn
        </a>
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
      trackActivity("chat_submit", "gemini_terminal");

      try {
        const token = await getToken();
        const response = await fetch("/api/chat-gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: SYSTEM_PROMPT,
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
      trackActivity("nav_click", id);
    }
  };

  return (
    <div className="gemini-theme">
      <Head>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async></script>
        <link rel="icon" href="./assets/eyes.gif" sizes="any" type="image/png"></link>
        <title>Chenghong Meng | Full-Stack Developer</title>
        <meta
          name="description"
          content="Win95-style portfolio for Chenghong Meng, focused on backend systems, React, and LLM tooling."
        />
      </Head>
      <div className="page-shell" id="top">
        <main className="page-grid">
          <WindowFrame id="hero_window" title="IDENTITY_V95.SYS" className="hero-window">
            <div className="hero-layout">
              <div className="hero-copy">
                <h1 className="hero-title">
                  CHENGHONG MENG
                  <span className="hero-title-sub">Full-Stack Developer, <span className="text-slate-600 text-sm font-thin">with AI applied mindset</span> | SF Bay Area</span>
                </h1>
                <div className="hero-summary">
                  Converting complex physical-world logic into high-efficiency digital architecture.
                  Targeting roles that require rigor, scale, and AI integration.
                </div>
                <div className="hero-meta">
                  <div className="meta-cell">
                    <div className="meta-label">FOCUS</div>
                    <div className="meta-value">Backend + LLM</div>
                  </div>
                  <div className="meta-cell">
                    <div className="meta-label">STACK</div>
                    <div className="meta-value">Laravel / React / Python</div>
                  </div>
                  <div className="meta-cell">
                    <div className="meta-label">MODE</div>
                    <div className="meta-value">Production first</div>
                  </div>
                  <div className="meta-cell">
                    <div className="meta-label">STATUS</div>
                    <div className="meta-value">Available</div>
                  </div>
                </div>
              </div>
              <pre className="hero-art" aria-hidden="true">{`      _ [LAB] _
    /   \\_____/   \\
   | [CH] |   | [01] |
    \\ ___ /   \\ ___ /
      /   \\_____/   \\
     | [AI] |   | [LLM]|
      \\ _ /     \\ _ /`}</pre>
            </div>
          </WindowFrame>

          <section className="section-block" id="sec_projects">
            <SectionHeader num="02" label="Projects" />
            <h2 className="section-heading">
              Selected
              <br />
              Projects.
            </h2>
            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Neural Link Terminal */}
          <section className="section-block" id="sec_neural_link">
            <SectionHeader num="03" label="Neural Link" />
            <div className="terminal-window win95-inset">
              <div className="win95-header" style={{ marginBottom: 0 }}>
                <span>📡 REMOTE_NEURAL_LINK.EXE (GEMINI_DIRECT)</span>
              </div>
              <div className="terminal-body" ref={terminalBodyRef}>
                <div className="terminal-line-ai">[SYSTEM]: NEURAL LINK ESTABLISHED. POWERED BY GEMINI PRO.</div>
                {history.map((msg, i) => (
                  <div key={i} className={msg.role === "user" ? "terminal-line-user" : "terminal-line-ai"}>
                    {msg.role === "user" ? `> ${msg.content}` : msg.content}
                  </div>
                ))}
                {isThinking && <div className="animate-pulse">THINKING...</div>}
              </div>
              <div className="terminal-input-area">
                <span className="terminal-prompt">&gt;</span>
                <input
                  type="text"
                  className="terminal-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleSubmit}
                  placeholder="Ask about my projects..."
                />
              </div>
            </div>
          </section>

          <section className="section-block" id="sec_how_i_work">
            <SectionHeader num="04" label="How I work" />
            <div className="work-grid">
              {workCards.map((card) => (
                <article key={card.id} id={card.id} className="work-card" onClick={() => trackActivity("click", card.id)}>
                  <div className="work-card-num">{card.num}</div>
                  <h3 className="work-card-title">{card.title}</h3>
                  <p className="work-card-desc">{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-block" id="sec_contact">
            <SectionHeader num="05" label="Contact" />
            <h2 className="contact-heading">
              Let&apos;s build
              <br />
              something.
            </h2>
            <ContactBlock />
          </section>
        </main>

        <footer className="page-footer">
          <span>Chenghong Meng — Full-Stack Developer - San Francisco, CA</span>
          <span>2026</span>
        </footer>
      </div>

      {/* Win95 Taskbar */}
      <div className="win95-taskbar">
        <div className="win95-start-btn" onClick={() => scrollTo("top")}>
          <img src="/assets/gemini_icon.png" alt="Gemini" />
          <span>Start</span>
        </div>
        <div className="taskbar-divider" />
        <div className="taskbar-tabs">
          <div className="taskbar-tab" onClick={() => scrollTo("sec_projects")}>
            Projects.exe
          </div>
          <div className="taskbar-tab" onClick={() => scrollTo("sec_neural_link")}>
            NeuralLink.com
          </div>
          <div className="taskbar-tab" onClick={() => scrollTo("sec_how_i_work")}>
            HowIWork.log
          </div>
          <div className="taskbar-tab" onClick={() => scrollTo("sec_contact")}>
            Contact.sys
          </div>
        </div>
        <div className="taskbar-tray">
          <img src="/assets/gemini_icon.png" alt="" style={{ width: 14, height: 14, filter: "grayscale(100%) brightness(0)" }} />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
