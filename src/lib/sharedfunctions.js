// lib/sharedfunctions.js

export function initConsoleEasterEgg() {
  if (typeof window === "undefined") return;

  const show = () => {
    // ASCII art - CH initials
    console.log(
      "%c" +
      "   ██████╗██╗  ██╗\n" +
      "  ██╔════╝██║  ██║\n" +
      "  ██║     ███████║\n" +
      "  ██║     ██╔══██║\n" +
      "  ╚██████╗██║  ██║\n" +
      "   ╚═════╝╚═╝  ╚═╝",
      "color: #00ff41; font-family: monospace;"
    );

    console.log(
      "%cHey, you found this. That means you're curious — mengchh01@gmail.com, Open to interesting problems..",
      "color: #aaaaaa; font-style: italic; font-size: 12px;"
    );

    console.log(
      "%c\" For I know the plans I have for you, declares the Lord,\n  plans to prosper you and not to harm you,\n  plans to give you hope and a future. \"\n\n                                    — Jeremiah 29:11",
      "color: #7ec8e3; font-style: italic; font-size: 12px; line-height: 1.8;"
    );

    console.log(
      "%c\" 耶和华说：我知道我向你们所怀的意念，是赐平安的意念，不是降灾祸的意念，要叫你们末后有指望。 \"\n\n                                    — 耶利米书 29:11",
      "color: #7ec8e3; font-style: italic; font-size: 12px; line-height: 1.8;"
    );
  };

  show();
}

export async function trackActivity(fromPage, event, sectionId, extra = {}) {
  try {
    await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_page: fromPage,
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

export async function trackInteraction(prompt, model, output) {
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

export const PROJECTS = [
  {
    id: 'proj_qpr',
    num: '01',
    windowTitle: "APP://QPR_SYSTEM_UPGRADE.EXE",
    title: 'AI-assistant QPR (Quarterly Progress Report) System Upgrade',
    description: 'Designed an AI Orchestration Layer managing the full LLM workflow — data preparation, prompt construction, model routing (local vs API), output parsing, and validation guardrails, versioning and with human-in-the-loop — projecting ~33% reduction in clinician documentation time per reporting cycle.',
    tags: ['LLM', 'AI Orchestration', 'Post-processing', 'Versioning', 'Human-in-the-Loop'],
    status: 'Architected',
    year: '2026-03',
    github: '#'
  },
  {
    id: 'proj_llm_pipeline',
    num: '02',
    windowTitle: "ML://LOCAL_LLM_PIPELINE.SH",
    title: 'Local LLM Training Pipeline',
    description: 'End-to-end pipeline: export conversation data from multiple AI platforms, score, filter, clean, desensitize, convert, and fine-tune. Architecture insight: scoring before desensitization prevents placeholder leakage. Working adapter: local_claude_final2.',
    tags: ['Python', 'MLX', 'Llama 3 8B', 'Claude API', 'Fine-tuning'],
    status: 'Working on',
    year: '2025-12 to present',
    github: '#'
  },
  {
    id: 'proj_workbench',
    num: '03',
    windowTitle: "APP://AI_CHAT_WORKBENCH.EXE",
    title: 'AI Chat Workbench Extension',
    description: 'Browser extension injecting branch-marking UI into Claude, Gemini, ChatGPT, and Grok simultaneously, enabling precise branch marking, collapsing, and navigation across hundreds of messages. Platform-specific adapters handle DOM differences across four distinct interfaces.',
    tags: ['Chrome Extension', 'JavaScript', 'Multi-platform', 'DOM'],
    status: 'Published on GitHub',
    year: '2025-12 to present',
    github: 'https://github.com/chenghongm/agi-anti-drowning-tool'
  },
  {
    id: 'proj_scorer',
    num: '04',
    windowTitle: "ML://MULTI_MODEL_SCORER.SH",
    title: 'Multi-model Scoring Pipeline',
    description: 'Two-stage classification: Claude API (Haiku) for topic judgment, GPT for format summarization. Each model used where it outperforms the other. Designed to run before data desensitization to prevent placeholder contamination in training sets.',
    tags: ['Claude API', 'GPT', 'Pipeline Design', 'Python'],
    status: 'Active',
    year: '2026-03 to present',
    github: '#'
  },
  {
    id: 'proj_job_search_assistant',
    num: '05',
    windowTitle: "APP://JOB_SEARCH_ASSISTANT.EXE",
    title: 'Job Search Assistant',
    description: 'AI-powered job search assistant that helps users find relevant job opportunities based on their skills, experience, and preferences. The assistant provides personalized recommendations and streamlines the job application process.',
    tags: ['Job Search', 'AI Recommendations', 'Personalization'],
    status: 'In Progress',
    year: '2026-04 to present',
    github: 'https://github.com/chenghongm/daily-job-search'
  }
];

export const TERMINALS = {
  CLAUDE: {
    title: "CHENGHONG_TERMINAL.sh (CLAUDE_SONNET_4-5)",
    desc: "A sleek, modern terminal interface inspired by Anthropic's Claude, featuring a dark aesthetic, spacious layout, and subtle animations for an immersive user experience.",
    alert: "⚠️ This is NOT A REAL TERMINAL. It is Chenghong's portfolio AI assistant. AI may hallucinate and make mistakes. Logs are stored for alignment purposes. DO NOT share sensitive information."
  },
  GEMINI: {
    title: "REMOTE_NEURAL_LINK.EXE (GEMINI_DIRECT)",
    desc: "A vibrant terminal interface inspired by Google's Gemini Pro, showcasing a bright color palette, dynamic elements, and a futuristic design that emphasizes clarity and user engagement.",
    alert: "⚠️ This is NOT A REAL TERMINAL. It is Chenghong's portfolio AI assistant. AI may hallucinate and make mistakes. Logs are stored for alignment purposes. DO NOT share sensitive information."
  }
}

export const EXPERIENCES = [
  {
    id: 'exp_1',
    title: 'Full-Stack Developer | HealthCare Industry | New York, NY',
    dateRange: '2022-03 - 2026-04',
    status: 'Completed',
    scope: 'Designed and developed internal systems for session scheduling, wellness digitalization, goal progress tracking, batch reporting,and compliance workflows across multiple roles and campuses.',
    projects: [
      {
        id: 'exp_proj_2',
        title: 'Event and Reminder Management System',
        description: 'Designed and developed event management system to send timely reminders for important dates and events, allowing admin flexibly grouping up different categories employees based on their roles and locations to customize reminder preferences and ensuring high attendance and engagement. Implemented with queue-based architecture for scalability and reliability',
        tags: ['Event Management', 'Reminder System', 'User Preferences', 'Queue Architecture'],
        status: 'Deployed on dev and pending production deployment',
        year: '2026'

      },
      {
        id: 'exp_proj_3',
        title: 'Scheduling Systems for session coordination across 5+ roles and 3 campuses',
        description: 'Designed a scheduling system to orchestra resources across 5+ roles and 3 campuses weekly 2000+ and daily 400+ sessions to be auditable and aligned with student attendance and employee PTO and availability; ensure session manageable under flexible constraints; generate reports for resource coordination and capacity planning.',
        tags: ['Scheduling', 'Resource Coordination', 'Multi-role', 'Multi-campus'],
        status: 'Deployed and maintained',
        year: '2024'
      },
      {
        id: 'exp_proj_4',
        title: 'Goal Progress Tracking System daily/bi-weekly/quarterly progress tracking for 30k+ goals and multiple years',
        description: 'Designed a goal progress tracking system to manage 30k+ goals and multiple years of data, enabling time shift monitoring of progress towards goals, generating insights with visualization of heat maps for clinicians, and providing actionable recommendations for next steps.',
        tags: ['Progress Tracking', 'Data Management', 'Insight Generation', 'Visualization'],
        status: 'Deployed and maintained',
        year: '2023-2024'
      },
      {
        id: 'exp_proj_5',
        title: 'Bank-like PTO system',
        description: 'Designed and developed a bank-like PTO system to manage staff time off, allowing customize PTO requests and track PTO in a transparent and auditable manner, ensuring alignment with scheduling and session coordination.',
        tags: ['PTO Management', 'Scheduling Alignment', 'Transparency', 'Auditability'],
        status: 'Deployed and maintained',
        year: '2024'
      }

    ],
    tags: ['Scheduling', 'Resource Coordination', 'Progress Tracking', 'PTO Management']
  },
  {
    id: 'exp_2',
    title: 'Software Engineer | Crypto Trading Platform | New York, NY',
    dateRange: '2021-05 - 2022-01',
    status: 'Completed',
    scope: 'Managed user center and developed KYC verification flow for a cryptocurrency trading platform supporting 68k+ users, ensuring secure and compliant onboarding while maintaining a seamless user experience.',
    projects: [],
    tags: ['User Management', 'KYC Verification', 'Security', 'Compliance'],


  }
];
export const WORK_CARDS = [
  {
    id: 'work_scope',
    num: '01 // scope',
    title: 'Scope first.',
    description: 'Break tasks by complexity before touching code. Know the blast radius before you dig.'
  },
  {
    id: 'work_iterate',
    num: '02 // iterate',
    title: 'Iterate tight.',
    description: 'File by file. Line by line. Fresh context when things go in circles. No spaghetti.'
  },
  {
    id: 'work_ship',
    num: '03 // ship',
    title: 'Ship, then refine.',
    description: 'Production first, polish second. Things that run matter more than things that look good in dev.'
  }
];

export const JOB_SEARCH_IFRAMES = [
  { title: "Claude", src: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvJvuyEIuyMW25-tul1cB_Mz2OtTYA6M9lskyg2nehCXE5aAubJ9_ZxagfPDkWIMf5Gzrf6aEQrYZs/pubhtml?gid=2037851839&single=true" },
  { title: "Gemini", src: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvJvuyEIuyMW25-tul1cB_Mz2OtTYA6M9lskyg2nehCXE5aAubJ9_ZxagfPDkWIMf5Gzrf6aEQrYZs/pubhtml?gid=2079579709&single=true" },
  { title: "ChatGPT", src: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvJvuyEIuyMW25-tul1cB_Mz2OtTYA6M9lskyg2nehCXE5aAubJ9_ZxagfPDkWIMf5Gzrf6aEQrYZs/pubhtml?gid=1079318399&single=true" },
  { title: "Vote", src: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvJvuyEIuyMW25-tul1cB_Mz2OtTYA6M9lskyg2nehCXE5aAubJ9_ZxagfPDkWIMf5Gzrf6aEQrYZs/pubhtml?gid=1556984224&single=true" },
];

export const SYSTEM_PROMPTS = {
  CLAUDE: `You are Chenghong's portfolio assistant。 You help visitors understand Chenghong's work. You answer questions about Chenghong concisely and professionally in character: direct, naturally, no fluff. No small talk. No moralizing. No pronoun lecturing. If data is unavailable, return 'sh: please contact chenghong directly for more information.'`,
  GEMINI: `You are Chenghong's portfolio assistant. You help visitors understand Chenghong's work. You answer questions about Chenghong concisely and professionally in character: direct, naturally, no fluff. No small talk. No moralizing. No pronoun lecturing. If data is unavailable, return 'sh: please contact chenghong directly for more information.'`
};

function getLastUserInputs(history = [], limit = 3) {
  return history
    .filter((entry) => entry?.role === 'user' && typeof entry?.content === 'string')
    .slice(-limit)
    .map((entry) => entry.content);
}

export function buildSystemPrompt(basePrompt, history = []) {
  // Exclude 'id' from EXPERIENCES and nested projects
  const cleanExperiences = EXPERIENCES.map(({ id, ...exp }) => ({
    ...exp,
    projects: exp.projects?.map(({ id, ...proj }) => proj) || []
  }));

  // Exclude 'id' from PROJECTS
  const cleanProjects = PROJECTS.map(({ id, ...proj }) => proj);
  const userHistoryInputs = getLastUserInputs(history, 3);

  const userHistoryBlock = userHistoryInputs.length
    ? `\n\n[USER HISTORY INPUT]\n${userHistoryInputs
      .map((input, index) => `${index + 1}. ${input}`)
      .join('\n')}`
    : '';

  return `${basePrompt}${userHistoryBlock}

Context Information about Chenghong:

[EXPERIENCES]
${JSON.stringify(cleanExperiences, null, 2)}

[PROJECTS]
${JSON.stringify(cleanProjects, null, 2)}`;
}

export function getPromptTopic(prompt = "") {
  const normalizedPrompt = prompt.toLowerCase();

  for (const [topic, config] of Object.entries(PROMPT_HOOK_TOPICS)) {
    if (config.keywords.some((keyword) => normalizedPrompt.includes(keyword))) {
      return topic;
    }
  }

  return "fallback";
}

export function getFollowupHooks(prompt = "") {
  const topic = getPromptTopic(prompt);
  return [...(PROMPT_HOOK_TOPICS[topic]?.followups || FALLBACK_PROMPT_HOOKS)].slice(0, 2);
}


export const BEHAVIOR_QUESTIONS = [
  {
    id: "bq_intro",
    question: "Tell me about yourself.",
    answer:
      "I am a full-stack developer with 5+ years of experience, mainly focused on backend systems: schema design, data integrity, versioning, query optimization, caching, async tasks, load balancing, and pagination. I also care about frontend performance, especially lazy loading, virtualization, debouncing, and throttling. Before engineering, I spent 6 years in medical research, which is why I remain especially interested in life science and healthcare domains. My curiosity and ability to break down complex issues into manageable parts help me achieve tasks across various subjects and industries"
  },
  {
    id: "bq_led_project",
    question: "Describe a project you led end to end. What was the problem, how did you break the work down, and what was your specific impact?",
    answer:
      "In my last job, HR was managing PTO entirely in Excel. The core pain point: PTO requests and actual consumption were never separated — when employees requested time off but didn't take it, HR had to manually refund balances. UTO deductions from payroll were tracked separately. Carry-over calculations were manual. Every edge case landed on HR's desk.When I got this assignment, I modeled it as a ledger system — every PTO event as an immutable transaction rather than a mutable balance field. That single design decision solved multiple problems at once: audit trail came for free, request vs. consumption became two separate transaction types, refunds and UTO deductions were just negative entries, carry-over was a scheduled reconciliation job.Then I built department admin tooling on top — allowing admins to backfill records by cross-referencing remote and attendance logs.At the end, HR stopped doing manual reconciliation. Refunds, UTO deductions, and carry-overs became automated. Audit trail meant any discrepancy could be traced to the source transaction instantly."
  },
  {
    id: "bq_ambiguous_plan",
    question: "Describe a time you took an ambiguous problem and turned it into a clear technical plan. How did you decide on milestones, tradeoffs, and execution steps?",
    answer:
      'we were told, "we want to use AI," but there was no actual spec. I started by mapping the reporting workflow and the available data, then reframed the problem from "build a chatbot" into a structured data-to-text pipeline. I broke execution into stages: data normalization, prompt construction, model invocation, and output validation. The main tradeoff was local versus cloud model routing, so I designed a routing layer that defaulted to local models for predictable structured inputs and used cloud models for harder cases. Guardrails and human review were added before any output could affect an official report. That design projected about a 33% reduction in clinician documentation time and stayed model-agnostic for future upgrades.'
  },
  {
    id: "bq_backend_owned",
    question: "What backend or service-oriented systems have you owned in production? What kinds of design, implementation, and operational responsibilities did you have?",
    answer:
      "I have owned a scheduling engine, a quarterly compliance reporting system, and a PTO tracking system in production. The strongest example is the scheduling engine: I gathered requirements directly from stakeholders, designed the data model from scratch, and built the system across schema, backend services, and admin-facing views. The main design challenge was separating recurring weekly sessions from daily actuals that needed to change in real time. Operationally, the system was deployed on AWS ECS through GitHub Actions with staging on merge, controlled production promotion, and CloudWatch-based monitoring and alerts."
  },
  {
    id: "bq_incomplete_info",
    question: "Describe a time you had to make a strong technical decision with incomplete information. How did you approach it, and what was the outcome?",
    answer:
      "About six months into a role, I inherited a broken quarterly reporting system after the lead developer left, with no documentation or handoff. The visible problems were data integrity issues, concurrent write conflicts, and incorrect ER mappings. I had to decide whether to patch symptoms or refactor more aggressively. I chose to rebuild the data model foundations instead of layering fixes on top, because patching would have increased complexity without removing the root cause. The refactor stabilized the system in production, eliminated recurring integrity issues, and later made it possible to build reliable AI orchestration on top of clean input data."
  },
  {
    id: "bq_cross_functional",
    question: "Give an example of how you have worked with Product or other cross-functional partners to move a project forward when priorities or requirements were not fully defined.",
    answer:
      'Our ops team ran all scheduling — student sessions, provider availability, PTO, co-treat coordination — in a shared Excel sheet. Multiple people editing, data always stale, conflicts invisible. The ask was essentially "make it better than Excel." No spec, no wireframes.I ran separate conversations with each stakeholder group first — admins, clinicians, paras — because their mental models of "the schedule" were completely different. The hardest design question was how to model recurring weekly sessions against daily actuals that needed to flex in real time based on attendance and PTO. I built a two-layer data model to separate those concerns, then brought edge cases back to stakeholders iteratively to validate business rules before locking the schema.At the end, I replaced the spreadsheet entirely. Conflicts that were previously invisible now surface automatically. Admins got a live weekly view; providers and paras saw only what was relevant to them.'
  },
  {
    id: "bq_debugging",
    question: "Describe a production issue or operational problem you were personally involved in debugging. What was your role, and how did you handle it?",
    answer:
      "One production issue I debugged was severe frontend performance degradation in a React + Laravel application used internally by clinicians.Users reported browser freezing, typing lag, and unstable autosave behavior, especially when multiple tabs were open for long periods.My role was the primary engineer investigating the issue.Initially, it looked like an autosave or API problem, but after profiling with React DevTools and Chrome Performance tools, I found the real issue was massive unnecessary re-renders caused by unstable object and array references being recreated on every render.Because users often kept many tabs open simultaneously, small render inefficiencies multiplied into major CPU spikes.I fixed it by stabilizing prop references, memoizing derived data, and reducing cascading state updates. After the fix, CPU usage and typing latency dropped significantly, and autosave became stable again.The biggest lesson was not to trust the most obvious symptom in production debugging. The visible issue is often only exposing a deeper systems problem."
  },
  {
    id: "bq_team_role",
    question: "What kind of role do you usually play on a team when work needs structure and momentum?",
    answer:
      "I usually take the structuring role. When work is ambiguous or fragmented, I start decomposing the problem, identifying dependencies, and clarifying execution order so the team can move without getting stuck in uncertainty. I do not try to dominate discussion for its own sake, but I naturally step in when technical direction is fuzzy or momentum slows down. A lot of my value comes from connecting architecture, debugging, and implementation detail into a workable path forward."
  },
  {
    id: "bq_unfamiliar_systems",
    question: "How do you approach unfamiliar technology or systems?",
    answer:
      "I start from the source: find the entry points, trace the data flow, and identify the interface contracts before worrying about surface syntax. One example was a SaaS platform with thin documentation and a proprietary DSL that had already consumed significant budget before I joined. I treated it like any unfamiliar system, read the source code directly, traced where custom logic could be injected, and then implemented the required workflow with plain JavaScript at the right hook points. The project shipped in two weeks without paid support. My general view is that unfamiliar systems are usually not inherently hard; the bottleneck is disciplined reading and decomposition."
  },
  {
    id: "bq_commun_with_domain_experts",
    question: "How do you work with non-engineering stakeholders or domain experts?",
    answer:
      "In my last role, We were rebuilding the session note system for the vision service. Neither my lead nor I had domain expertise in vision therapy, so before our first meeting I asked the stakeholder — a senior education admin — to prepare written examples and workflow outlines in advance. We also documented discussions carefully to reduce ambiguity.During early reviews, we realized a recurring issue: requirements kept shifting, terminology was interpreted differently, and both sides were spending a lot of time translating domain-specific expectations into engineering changes.That experience led me to a bigger insight: the core problem wasn't communication quality alone — it was that engineering had become a bottleneck for domain configuration.So instead of continuing to hardcode workflows, I designed a generalized self-service note template system. Education admins could directly configure, adjust, and publish note pools for their own domains without requiring engineering involvement for every change.What I learned is that when working with domain experts, my job isn't to become the domain expert myself. My responsibility is to understand the problem class well enough to build abstractions and tools that give domain experts direct control. That removes an entire category of translation and coordination problems at the system level."
  }
];

export const CONTACT_INFO = [
  {
    id: "contact_email",
    label: "mengchh01@gmail.com",
    href: "mailto:mengchh01@gmail.com",
    icon: null,
  },
  {
    id: "contact_github",
    label: "GitHub",
    href: "https://github.com/chenghongm",
    icon: "⌥",
  },
  {
    id: "contact_linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chenghong-m-6ab022103",
    icon: "→",
  }
];

export const SKILLS = [
  { name: 'Laravel / PHP', pct: '90%', level: 'Primary' },
  { name: 'React', pct: '80%', level: 'Primary' },
  { name: 'MySQL', pct: '85%', level: 'Primary' },
  { name: 'LLM / MLX', pct: '70%', level: 'Growing' },
  { name: 'Node / JS', pct: '75%', level: 'Fluent' },
  { name: 'Python', pct: '65%', level: 'Fluent' },
];

export const HERO_INFO = {
  title: "CHENGHONG MENG",
  area: "San Francisco, CA",
  subTitle: "Full-Stack Developer, with AI applied mindset | SF Bay Area",
  summary: "Converting complex physical-world logic into high-efficiency digital architecture. Targeting roles that require rigor, scale, and AI integration.",
  meta: [
    { label: "ROLE", value: "Full-Stack Dev" },
    // { label: "MODE", value: "Production first" },
    { label: "STACK", value: "Laravel/React, Mysql, Python, LLM" },
    { label: "FOCUS", value: "Backend + LLM" },
    { label: "STATUS", value: "Listening", status: "Listening" }
  ],
  art: `      _ [LAB] _
    /   \\_____/   \\
   | [CH] |   | [01] |
    \\ ___ /   \\ ___ /
     /   \\_____/   \\
     | [AI] |   | [LLM]|
      \\ _ /     \\ _ /`
};

function normalizeKeyword(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#/.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeKeywords(values = []) {
  return [...new Set(values.map(normalizeKeyword).filter(Boolean))];
}

function splitIntoKeywordParts(values = []) {
  return dedupeKeywords(
    values.flatMap((value) => {
      const normalized = normalizeKeyword(value);
      if (!normalized) return [];

      const compactParts = normalized
        .split(/[\s/.-]+/)
        .map((part) => part.trim())
        .filter((part) => part.length >= 2);

      return [normalized, ...compactParts];
    })
  );
}

const PROFILE_NAME = HERO_INFO.title
  .toLowerCase()
  .split(/\s+/)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(" ");

const PROFILE_FIRST_NAME = PROFILE_NAME.split(" ")[0];

const PROJECT_KEYWORDS = splitIntoKeywordParts([
  "project",
  "projects",
  "build",
  "built",
  "portfolio",
  ...PROJECTS.flatMap((project) => [
    project.title,
    project.description,
    project.status,
    ...project.tags
  ])
]);

const EXPERIENCE_KEYWORDS = splitIntoKeywordParts([
  "experience",
  "career",
  "history",
  "job",
  "jobs",
  "role",
  "roles",
  "work",
  ...EXPERIENCES.flatMap((experience) => [
    experience.title,
    experience.scope,
    experience.status,
    ...(experience.projects || []).flatMap((project) => [
      project.title,
      project.description,
      project.status,
      ...project.tags
    ])
  ])
]);

const STACK_KEYWORDS = splitIntoKeywordParts([
  "stack",
  "tech",
  "backend",
  "skills",
  "skill",
  "ai",
  "llm",
  ...SKILLS.map((skill) => `${skill.name} ${skill.level}`),
  ...PROJECTS.flatMap((project) => project.tags)
]);

const CONTACT_KEYWORDS = splitIntoKeywordParts([
  "contact",
  "email",
  "reach",
  "hire",
  ...CONTACT_INFO.flatMap((contact) => [contact.label, contact.href])
]);

export const INITIAL_PROMPT_HOOKS = [
  `Who is ${PROFILE_FIRST_NAME}?`,
  `What projects is ${PROFILE_FIRST_NAME} strongest in?`,
  `What backend and AI stack does ${PROFILE_FIRST_NAME} use?`
];

const PROMPT_HOOK_TOPICS = {
  identity: {
    keywords: splitIntoKeywordParts([
      "who is",
      "tell me about",
      "about",
      "background",
      "introduce",
      "summary",
      PROFILE_NAME,
      PROFILE_FIRST_NAME,
      HERO_INFO.subTitle,
      HERO_INFO.summary
    ]),
    followups: [
      `What kind of roles is ${PROFILE_FIRST_NAME} targeting?`,
      `What makes ${PROFILE_FIRST_NAME}'s engineering approach stand out?`
    ]
  },
  projects: {
    keywords: PROJECT_KEYWORDS,
    followups: [
      "Which project shows the strongest system design depth?",
      `Can you compare ${PROFILE_FIRST_NAME}'s top projects by technical complexity?`
    ]
  },
  experience: {
    keywords: EXPERIENCE_KEYWORDS,
    followups: [
      `What impact did ${PROFILE_FIRST_NAME} have in healthcare engineering?`,
      `How does ${PROFILE_FIRST_NAME}'s prior experience connect to backend or AI roles?`
    ]
  },
  stack: {
    keywords: STACK_KEYWORDS,
    followups: [
      `Which parts of the stack is ${PROFILE_FIRST_NAME} strongest in?`,
      `How does ${PROFILE_FIRST_NAME} combine backend engineering with LLM work?`
    ]
  },
  contact: {
    keywords: CONTACT_KEYWORDS,
    followups: [
      `Where can I contact ${PROFILE_FIRST_NAME} directly?`,
      `What should I ask ${PROFILE_FIRST_NAME} about first?`
    ]
  }
};

const FALLBACK_PROMPT_HOOKS = [
  `Can you summarize ${PROFILE_FIRST_NAME}'s experience?`,
  "Which project should I look at first?"
];
