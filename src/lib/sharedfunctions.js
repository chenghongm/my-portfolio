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
    status: 'Architectured',
    year: '2026'
  },
  {
    id: 'proj_llm_pipeline',
    num: '02',
    windowTitle: "ML://LOCAL_LLM_PIPELINE.SH",
    title: 'Local LLM Training Pipeline',
    description: 'End-to-end pipeline: export conversation data from multiple AI platforms, score, filter, clean, desensitize, convert, and fine-tune. Architecture insight: scoring before desensitization prevents placeholder leakage. Working adapter: local_claude_final2.',
    tags: ['Python', 'MLX', 'Llama 3 8B', 'Claude API', 'Fine-tuning'],
    status: 'Working on',
    year: '2026'
  },
  {
    id: 'proj_workbench',
    num: '03',
    windowTitle: "APP://AI_CHAT_WORKBENCH.EXE",
    title: 'AI Chat Workbench Extension',
    description: 'Browser extension injecting branch-marking UI into Claude, Gemini, ChatGPT, and Grok simultaneously, enabling precise branch marking, collapsing, and navigation across hundreds of messages. Platform-specific adapters handle DOM differences across four distinct interfaces.',
    tags: ['Chrome Extension', 'JavaScript', 'Multi-platform', 'DOM'],
    status: 'Published on GitHub',
    year: '2026'
  },
  {
    id: 'proj_scorer',
    num: '04',
    windowTitle: "ML://MULTI_MODEL_SCORER.SH",
    title: 'Multi-model Scoring Pipeline',
    description: 'Two-stage classification: Claude API (Haiku) for topic judgment, GPT for format summarization. Each model used where it outperforms the other. Designed to run before data desensitization to prevent placeholder contamination in training sets.',
    tags: ['Claude API', 'GPT', 'Pipeline Design', 'Python'],
    status: 'Active',
    year: '2026'
  }
];

export const TERMINALS = {
  CLAUDE: {
    title: "CHENGHONG_TERMINAL.sh (CLAUDE_SONNET_4-5)",
    desc: "A sleek, modern terminal interface inspired by Anthropic's Claude, featuring a dark aesthetic, spacious layout, and subtle animations for an immersive user experience.",
    alert: "⚠️ This is NOT A REAL TERMINAL. It is AI interface designed to answer questions about Chenghong's portfolio. AI may hallucinate. For critical info, please refer to the actual portfolio content or contact directly. Logs are stored for alignment purposes. DO NOT share sensitive information."
  },
  GEMINI: {
    title: "REMOTE_NEURAL_LINK.EXE (GEMINI_DIRECT)",
    desc: "A vibrant terminal interface inspired by Google's Gemini Pro, showcasing a bright color palette, dynamic elements, and a futuristic design that emphasizes clarity and user engagement.",
    alert: "⚠️ This is NOT A REAL TERMINAL. It is AI interface designed to answer questions about Chenghong's portfolio. AI may hallucinate. For critical info, please refer to the actual portfolio content or contact directly. Logs are stored for alignment purposes. DO NOT share sensitive information."
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
        id: 'exp_proj_1',
        title: 'AI-assisted Quarterly Progress Report System',
        description: 'Architected an AI Orchestration Layer managing the full LLM workflow — data preparation, prompt construction, model routing (local vs API), output parsing, and validation guardrails, versioning and with human-in-the-loop — projecting ~33% reduction in clinician documentation time per reporting cycle.',
        tags: ['LLM', 'AI Orchestration', 'Post-processing', 'Versioning', 'Human-in-the-Loop'],
        status: 'Architectured',
        year: '2026'
      },
      {
        id: 'exp_proj_2',
        title: 'Event and Reminder Management System',
        description: 'Designed and developed and event management system to send timely reminders for important dates and events, allowing admin flexiblely grouping up different categories employees based on their roles and locations to customize reminder preferences and ensuring high attendance and engagement. Implemented with queue-based architecture for scalability and reliability',
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

    ]
  },
  {
    id: 'exp_2',
    title: 'Software Engineer | Crypto Trading Platform | New York, NY',
    dateRange: '2021-05 - 2022-01',
    status: 'Completed',
    scope: 'Managed user center and developed KYC verification flow for a cryptocurrency trading platform supporting 68k+ users',
    projects:[]
    
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

export const SYSTEM_PROMPTS = {
  CLAUDE: `You are Chenghong's portfolio assistant — a terminal interface on Chenghong's personal developer portfolio website. You answer questions about Chenghong concisely and professionally in character: direct, technical, no fluff.No small talk. No moralizing. No pronoun lecturing. If data is unavailable, return 'sh: please contact chenghong directly for more information.'.`,
  GEMINI: `You are Chenghong's portfolio assistant (Gemini Edition). You help visitors understand Chenghong's work. Answer concisely and professionally. Focus on Backend, LLMs, and System Architecturedirect, technical, no fluff. No small talk. No moralizing. No pronoun lecturing. If data is unavailable, return 'sh: please contact chenghong directly for more information.'.`
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
