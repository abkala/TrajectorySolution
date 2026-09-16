export const servicePages = [
  { title: "Strategy & experience", url: "/services/#strategy", description: "Digital roadmaps, customer research, and product discovery.", keywords: "design consulting" },
  { title: "Digital engineering", url: "/services/#engineering", description: "Application development, APIs, and modernisation.", keywords: "software web development" },
  { title: "Cloud & platforms", url: "/services/#cloud", description: "Cloud readiness, migration planning, and platform engineering.", keywords: "infrastructure cloud migration" },
  { title: "Data & applied AI", url: "/services/#data", description: "Data quality, analytics, governance, and AI evaluation.", keywords: "artificial intelligence analytics" },
  { title: "Security & resilience", url: "/services/#security", description: "Security architecture, identity, and recovery planning.", keywords: "cybersecurity identity cyber" },
  { title: "Connected operations", url: "/services/#operations", description: "Integrated workflows, observability, and continuous improvement.", keywords: "automation monitoring" },
];

export const serviceReferencePages = [
  {
    title: "Applications & Communications Engineering (NCS reference)",
    url: "/services/applications-and-communications-engineering/",
    description: "An independent, attributed reference to NCS's Applications and Communications Engineering services.",
    keywords: "ncs ace applications communications engineering advanced comms physical ai data platforms native apps development maintenance cloud command control digital architecture enterprise intelligence product management security systems video reference",
  },
  {
    title: "Digital Resilience (NCS reference)",
    url: "/services/digital-resilience/",
    description: "An independent, attributed reference to NCS's Digital Resilience services.",
    keywords: "ncs digital resilience dr cloud virtualisation enterprise ai workforce evolution secured connectivity integrated secops access management cyber resilience service driven reference",
  },
];

export const careerReferencePages = [
  {
    title: "Career Development (NCS reference)",
    url: "/careers/chart-your-career/",
    description: "An independent NCS reference covering career tracks, role and skills mapping, competencies, training and certification.",
    keywords: "ncs career progression model job roles skills map competencies training certification talent programmes frameworks",
  },
];

export const sitePages = [
  {
    title: "AI Products & Platforms", url: "/ai-products-platforms/",
    description: "Explore responsible AI concepts, knowledge tools, and workflow intelligence.",
    keywords: "artificial intelligence models automation",
    links: [
      { title: "Our AI approach", url: "/ai-products-platforms/#overview", description: "Start with a useful question, not just a model." },
      { title: "Platform concepts", url: "/ai-products-platforms/#concepts", description: "Discover four ways intelligence could help." },
      { title: "Responsible evaluation", url: "/ai-products-platforms/#evaluation", description: "Set boundaries and measure what matters." },
    ],
  },
  {
    title: "Services", url: "/services/",
    description: "Explore illustrative Trejectory services and independently attributed NCS service references.",
    keywords: "technology consulting development",
    links: [...servicePages, ...serviceReferencePages],
  },
  {
    title: "Industries", url: "/industries/",
    description: "Explore possibilities across public services, healthcare, finance, education, transport, manufacturing, retail, and telecommunications.",
    keywords: "government energy consumer logistics sectors",
    links: [
      { title: "Industry overview", url: "/industries/#overview", description: "Technology grounded in your world." },
      { title: "Explore all eight sectors", url: "/industries/#industries", description: "Find the opportunities relevant to your industry." },
      { title: "Ideas in context", url: "/industries/#scenarios", description: "Explore illustrative real-world scenarios." },
    ],
  },
  {
    title: "Insights", url: "/insights/",
    description: "Original perspectives on cloud readiness, responsible AI, and human-centred design.",
    keywords: "articles thinking research",
    links: [
      { title: "Cloud readiness", url: "/insights/#cloud-readiness", description: "Understand the foundations before you move." },
      { title: "Responsible AI", url: "/insights/#responsible-ai", description: "Why useful intelligence needs clear boundaries." },
      { title: "Human-centred design", url: "/insights/#human-design", description: "Make room for different ways through." },
    ],
  },
  {
    title: "Partners", url: "/partners/",
    description: "Browse an independent NCS partner reference by name, expertise or website.",
    keywords: "ncs partner directory reference logos table technology",
    links: [
      { title: "About this reference", url: "/partners/#approach", description: "NCS attribution, not Trejectory affiliations." },
      { title: "Partner table & directory", url: "/partners/#partners", description: "Names, logos, website links and original summaries." },
      { title: "Technology areas", url: "/partners/#possibilities", description: "Explore editorial groupings of technology expertise." },
    ],
  },
  {
    title: "Careers", url: "/careers/",
    description: "Discover illustrative career paths and an independent reference to NCS career development.",
    keywords: "jobs graduates skills opportunities",
    links: [
      { title: "Life & culture", url: "/careers/#culture", description: "A vision of work shaped by good questions." },
      { title: "Explore career paths", url: "/careers/#paths", description: "Discover disciplines, skills, and practice ideas." },
      { title: "Learning & development", url: "/careers/#learning", description: "Build a learning loop worth keeping." },
      ...careerReferencePages,
    ],
  },
  {
    title: "About Us", url: "/about-us/",
    description: "Get to know the Trejectory concept, principles, and approach.",
    keywords: "company purpose values",
    links: [
      { title: "Our purpose", url: "/about-us/#perspective", description: "The idea behind our direction." },
      { title: "Our principles", url: "/about-us/#principles", description: "Practical beliefs that guide the work." },
      { title: "How we work", url: "/about-us/#approach", description: "Listen closely. Build deliberately." },
    ],
  },
];
