export type DealType = "credits" | "discount" | "free-plan" | "free-tier" | null

export type ResourceCategory =
  | "Cloud Infrastructure"
  | "Payments & Banking"
  | "Analytics"
  | "Communication"
  | "Design"
  | "Developer Tools"
  | "Productivity"
  | "CRM & Sales"
  | "AI & LLMs"
  | "AI Infrastructure"
  | "AI Coding"
  | "AI Voice & Video"
  | "E-Commerce"
  | "Legal"

export type StartupResource = {
  slug: string
  name: string
  tagline: string
  description: string
  category: ResourceCategory
  deal: string | null
  dealType: DealType
  whatYouGet: string[]
  eligibility: string
  applyUrl: string
  featured: boolean
}

export const ALL_CATEGORIES: ResourceCategory[] = [
  "AI & LLMs",
  "AI Coding",
  "AI Infrastructure",
  "AI Voice & Video",
  "Analytics",
  "Cloud Infrastructure",
  "Communication",
  "CRM & Sales",
  "Design",
  "Developer Tools",
  "E-Commerce",
  "Legal",
  "Payments & Banking",
  "Productivity",
]

export const resources: StartupResource[] = [
  // ── Cloud Infrastructure ──────────────────────────────────────────────────
  {
    slug: "aws-activate",
    name: "AWS Activate",
    tagline: "The world's most widely used cloud platform",
    description:
      "AWS is the most comprehensive cloud platform, with 200+ services including compute (EC2), storage (S3), managed databases, ML infrastructure, and more. The Activate program gives early-stage startups free credits to build and scale without upfront cloud costs.",
    category: "Cloud Infrastructure",
    deal: "Up to $200,000 in credits",
    dealType: "credits",
    whatYouGet: [
      "$1,000–$100,000 (Founders tier — no VC required)",
      "Up to $200,000 (Portfolio tier — accelerator or VC-affiliated)",
      "AWS Business Support for 1 year",
      "Credits valid for 2 years",
    ],
    eligibility: "Pre-seed to Series B startups. Higher tiers require affiliation with an AWS-partner accelerator or VC.",
    applyUrl: "https://aws.amazon.com/startups/credits/",
    featured: true,
  },
  {
    slug: "google-cloud-startups",
    name: "Google Cloud for Startups",
    tagline: "Cloud platform with an edge in AI and data",
    description:
      "Google Cloud provides compute, storage, BigQuery, and best-in-class AI/ML services via Vertex AI. The startup program offers among the highest credit amounts available, especially for AI-native companies building on Gemini or other Google models.",
    category: "Cloud Infrastructure",
    deal: "Up to $350,000 in credits",
    dealType: "credits",
    whatYouGet: [
      "Up to $350,000 for AI-first startups",
      "Up to $200,000 for general startups (Series A or earlier)",
      "$2,000 for pre-funded startups with no VC requirement",
      "Access to Google technical experts and mentorship",
    ],
    eligibility: "Pre-funded to Series A. AI-native startups building on Google models get the highest tier.",
    applyUrl: "https://cloud.google.com/startup",
    featured: true,
  },
  {
    slug: "microsoft-for-startups",
    name: "Microsoft for Startups",
    tagline: "Azure credits plus the full Microsoft ecosystem",
    description:
      "Microsoft for Startups (Founders Hub) gives you Azure cloud credits, GitHub Enterprise, Microsoft 365, and access to OpenAI models through Azure OpenAI Service — all in one program. Ideal for startups already using Microsoft or planning enterprise sales.",
    category: "Cloud Infrastructure",
    deal: "Up to $150,000 in Azure credits",
    dealType: "credits",
    whatYouGet: [
      "Up to $150,000 in Azure credits over time",
      "$1,000 immediately (self-service); $5,000 after verification",
      "GitHub Enterprise included",
      "Microsoft 365 and LinkedIn credits",
      "Access to Azure OpenAI Service",
    ],
    eligibility: "Open to all startups. Funded startups with verified status get higher credit tiers.",
    applyUrl: "https://www.microsoft.com/en-us/startups",
    featured: false,
  },
  {
    slug: "digitalocean-hatch",
    name: "DigitalOcean Hatch",
    tagline: "Simple cloud for developers and early-stage startups",
    description:
      "DigitalOcean is known for developer-friendly simplicity — VMs (Droplets), managed Kubernetes, and app platform. The Hatch program gives startups significant credits with less bureaucracy than hyperscalers, making it a popular choice for early-stage teams.",
    category: "Cloud Infrastructure",
    deal: "Up to $100,000 in credits",
    dealType: "credits",
    whatYouGet: [
      "Up to $100,000 in platform credits",
      "Typically $20,000 for 12 months through standard Hatch",
      "Access to managed Kubernetes (DOKS), databases, and App Platform",
    ],
    eligibility: "Early-stage startups. Apply directly or through a DigitalOcean partner.",
    applyUrl: "https://www.digitalocean.com/startups",
    featured: false,
  },
  {
    slug: "cloudflare-startups",
    name: "Cloudflare for Startups",
    tagline: "CDN, security, and edge compute for growing products",
    description:
      "Cloudflare provides CDN, DDoS protection, WAF, serverless computing (Workers), R2 object storage, and more. Their tiered startup program scales with your funding stage — meaning the more you've raised, the more credits you unlock.",
    category: "Cloud Infrastructure",
    deal: "$10,000–$350,000 in credits (tiered by funding)",
    dealType: "credits",
    whatYouGet: [
      "$10,000 — bootstrapped / pre-funded startups",
      "$100,000 — startups that have raised $1M+",
      "$350,000 — startups that have raised $5M+",
      "Access to Workers, R2, D1, and all paid features",
    ],
    eligibility: "Open to all startups. Credit tier depends on funding level. No equity required.",
    applyUrl: "https://www.cloudflare.com/startups/",
    featured: false,
  },

  // ── Payments & Banking ────────────────────────────────────────────────────
  {
    slug: "stripe-startups",
    name: "Stripe for Startups",
    tagline: "The payments infrastructure for the internet",
    description:
      "Stripe powers payments, subscriptions, billing, marketplace payouts, and financial APIs. Their startup program offers credits and waived fees to help you get to your first $1M in revenue without worrying about processing costs. Indian startups can integrate Stripe for international payments.",
    category: "Payments & Banking",
    deal: "$500–$2,500 in credits + waived fees",
    dealType: "credits",
    whatYouGet: [
      "$500 in API credits for general startup program",
      "$2,500 for Stripe Atlas companies",
      "Waived processing fees on first $10,000–$100,000 in payments (varies by partner)",
      "$50,000+ in partner perks via Stripe Atlas",
    ],
    eligibility: "Pre-seed to seed-stage startups. Atlas companies get higher tier automatically.",
    applyUrl: "https://stripe.com/startups/partners",
    featured: false,
  },
  {
    slug: "brex",
    name: "Brex",
    tagline: "Corporate cards and banking built for startups",
    description:
      "Brex offers corporate credit cards with high limits (based on funding, not personal credit), business checking accounts, bill pay, and treasury management — all in one platform. No personal guarantees required. Popular with VC-backed startups for managing burn.",
    category: "Payments & Banking",
    deal: "Free Essentials plan (cards + checking + bill pay)",
    dealType: "free-plan",
    whatYouGet: [
      "Free corporate credit cards with startup-friendly limits",
      "Business checking account with no fees",
      "Bill pay and expense management",
      "Yield-bearing treasury for idle cash",
      "Integrations with QuickBooks, NetSuite, Slack",
    ],
    eligibility: "Startups with a US entity and funding (or strong revenue). VC-backed startups preferred.",
    applyUrl: "https://www.brex.com/solutions/startups",
    featured: false,
  },
  {
    slug: "mercury",
    name: "Mercury",
    tagline: "Business banking designed for startups",
    description:
      "Mercury is a fintech offering business checking and savings accounts, virtual and physical debit cards, wire transfers, and treasury for startups. No monthly fees, no minimum balance, and a clean API — making it a favourite among early-stage founders.",
    category: "Payments & Banking",
    deal: "Free core banking with no minimums",
    dealType: "free-plan",
    whatYouGet: [
      "Free business checking and savings accounts",
      "No monthly fees, no minimum balance",
      "Virtual and physical debit cards",
      "ACH, wire, and check payments",
      "API access for financial automation",
    ],
    eligibility: "US-incorporated companies (Delaware C-corps and LLCs). Open to international founders with a US entity.",
    applyUrl: "https://mercury.com",
    featured: false,
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  {
    slug: "mixpanel",
    name: "Mixpanel",
    tagline: "Product analytics to understand what users actually do",
    description:
      "Mixpanel is a product analytics platform that helps you track user behavior, build funnels, run A/B experiments, and segment users by cohort. Their startup program is one of the most generous — giving you a full year free with no event limits.",
    category: "Analytics",
    deal: "1st year free (1 billion events/year)",
    dealType: "free-plan",
    whatYouGet: [
      "All product features free for 12 months",
      "Up to 1 billion events per year",
      "Unlimited saved reports, cohorts, and funnels",
      "No credit card required for startup plan",
    ],
    eligibility: "Startups less than 5 years old, under $8M raised, fewer than 5M monthly tracked users.",
    applyUrl: "https://docs.mixpanel.com/docs/pricing/startup-program",
    featured: true,
  },
  {
    slug: "amplitude",
    name: "Amplitude",
    tagline: "Digital analytics platform for product teams",
    description:
      "Amplitude provides deep product analytics with user journeys, behavioral cohorts, predictive analytics, and experiment tracking. The Growth plan (normally expensive) is free for a year for eligible startups, giving you enterprise-grade analytics from day one.",
    category: "Analytics",
    deal: "1 year free on Growth plan",
    dealType: "free-plan",
    whatYouGet: [
      "Full Growth plan free for 12 months",
      "Unlimited user journeys and cohorts",
      "Behavioral analytics and funnel analysis",
      "Experiment tracking and feature flags",
    ],
    eligibility: "Pre-seed to Series A startups. Apply through the Amplitude website or a partner accelerator.",
    applyUrl: "https://amplitude.com/startups",
    featured: false,
  },
  {
    slug: "posthog",
    name: "PostHog",
    tagline: "Open-source product analytics with session replay",
    description:
      "PostHog is an all-in-one product analytics suite — events, funnels, session recordings, feature flags, A/B testing, and more — hosted on your own infrastructure or their cloud. A generous free tier plus a massive YC credit make it accessible at any stage.",
    category: "Analytics",
    deal: "$50,000/year in credits (YC); generous free tier for all",
    dealType: "credits",
    whatYouGet: [
      "$50,000/year for YC companies",
      "1 million events/month free for all (no credit card)",
      "Session recordings, feature flags, A/B tests included",
      "Open-source — self-hostable with no vendor lock-in",
    ],
    eligibility: "Free tier is open to everyone. YC credits require Y Combinator affiliation.",
    applyUrl: "https://posthog.com/startups",
    featured: false,
  },
  {
    slug: "segment",
    name: "Segment (Twilio)",
    tagline: "Customer data platform to unify all your user data",
    description:
      "Segment is a customer data platform (CDP) that collects events from your web, mobile, and server-side sources and routes them to 400+ destinations — analytics tools, CRMs, ad platforms, and data warehouses. The startup program gives two free years of the Team plan.",
    category: "Analytics",
    deal: "Team plan free for 2 years (~$25,000 value)",
    dealType: "free-plan",
    whatYouGet: [
      "Team plan free for 24 months",
      "Up to 10,000 monthly tracked users",
      "Unlimited data sources and destinations",
      "Data warehousing and GDPR compliance tools",
    ],
    eligibility: "Startups less than 2 years old with under $5M raised. Apply through Twilio Startups.",
    applyUrl: "https://www.twilio.com/en-us/solutions/startups",
    featured: false,
  },

  // ── Communication ─────────────────────────────────────────────────────────
  {
    slug: "twilio",
    name: "Twilio",
    tagline: "Communications APIs for SMS, voice, and WhatsApp",
    description:
      "Twilio provides programmable SMS, voice calls, video, WhatsApp, and email APIs. If your product needs to send OTPs, notifications, or engage users over messaging channels, Twilio is the default choice. Their startup program offers meaningful credits to cover initial usage.",
    category: "Communication",
    deal: "$5,000–$10,000 in credits",
    dealType: "credits",
    whatYouGet: [
      "$5,000–$10,000 via Twilio AI Startup Searchlight program",
      "Basic account credits for new signups",
      "Access to SMS, Voice, WhatsApp, Verify, and Conversations APIs",
      "SendGrid email credits bundled",
    ],
    eligibility: "AI-focused startups preferred for the Searchlight program. Basic credits available to all new accounts.",
    applyUrl: "https://www.twilio.com/en-us/solutions/startups",
    featured: false,
  },
  {
    slug: "intercom",
    name: "Intercom Early Stage",
    tagline: "Customer messaging platform with AI support",
    description:
      "Intercom is a customer communications platform with live chat, AI chatbot (Fin), email campaigns, and a shared team inbox. The Early Stage program is one of the most generous in SaaS — 93% off in year one means you can run full customer support infrastructure for almost nothing.",
    category: "Communication",
    deal: "93% off Year 1, then 50% off Year 2",
    dealType: "discount",
    whatYouGet: [
      "93% off the full Intercom plan in Year 1",
      "50% off in Year 2, 25% off in Year 3",
      "1 year of Fin AI chatbot free",
      "Full access to live chat, campaigns, and inbox",
    ],
    eligibility: "Startups less than 2 years old, under $1M raised, fewer than 10 employees. Apply directly.",
    applyUrl: "https://www.intercom.com/early-stage",
    featured: true,
  },

  // ── Design ────────────────────────────────────────────────────────────────
  {
    slug: "figma-startups",
    name: "Figma for Startups",
    tagline: "The collaborative design tool for product teams",
    description:
      "Figma is the industry-standard design tool for UI/UX — wireframes, prototypes, design systems, and developer handoff all in one. Their startup program gives you credits to use the full platform, including Figma AI features, for your early-stage product team.",
    category: "Design",
    deal: "$1,000 in Figma credits",
    dealType: "credits",
    whatYouGet: [
      "$1,000 in Figma platform credits",
      "Access to Professional and Organization plans",
      "Figma AI features included",
      "Dev Mode for developer handoff",
    ],
    eligibility: "Startups affiliated with a Figma partner accelerator or VC. Apply directly for non-partner track.",
    applyUrl: "https://www.figma.com/startups",
    featured: false,
  },

  // ── Developer Tools ───────────────────────────────────────────────────────
  {
    slug: "github-for-startups",
    name: "GitHub for Startups",
    tagline: "Code hosting, CI/CD, Copilot, and security all-in-one",
    description:
      "GitHub for Startups gives you the full GitHub Enterprise stack — Copilot AI coding assistant, Advanced Security (GHAS), Actions for CI/CD, and unlimited private repositories. The $10,000 credit covers licenses for your entire engineering team.",
    category: "Developer Tools",
    deal: "$10,000 in GitHub Enterprise credits",
    dealType: "credits",
    whatYouGet: [
      "$10,000 in platform credits (12-month validity)",
      "GitHub Copilot Enterprise seats included",
      "Advanced Security (secret scanning, code scanning)",
      "GitHub Actions minutes for CI/CD",
      "Unlimited private repositories",
    ],
    eligibility: "Funded startups (up to Series B) new to GitHub Enterprise, affiliated with a GitHub partner.",
    applyUrl: "https://github.com/enterprise/startups",
    featured: false,
  },
  {
    slug: "auth0-startups",
    name: "Auth0 for Startups",
    tagline: "Authentication and identity management, out of the box",
    description:
      "Auth0 (by Okta) handles login, registration, MFA, social sign-in, SSO, and user management so you don't have to build auth from scratch. The startup program gives you a full year free on the Professional plan — covering up to 100,000 monthly active users.",
    category: "Developer Tools",
    deal: "1 year free Professional plan (up to 100k MAU)",
    dealType: "free-plan",
    whatYouGet: [
      "Professional plan free for 12 months",
      "Up to 100,000 monthly active users",
      "Enterprise Identity Providers (Okta, SAML, etc.)",
      "MFA, anomaly detection, and brute-force protection",
      "Unlimited social connections",
    ],
    eligibility: "Pre-seed to Series A startups. Apply via Auth0 website or through an affiliated accelerator.",
    applyUrl: "https://auth0.com/startups",
    featured: false,
  },
  {
    slug: "datadog-for-startups",
    name: "Datadog for Startups",
    tagline: "Infrastructure monitoring, APM, and observability",
    description:
      "Datadog is the leading observability platform — infrastructure metrics, APM (application performance monitoring), log management, synthetics, and security. For engineering teams shipping fast, knowing what's broken before customers report it is essential.",
    category: "Developer Tools",
    deal: "Up to $100,000 in credits for 1 year",
    dealType: "credits",
    whatYouGet: [
      "Up to $100,000 in platform credits for 12 months",
      "Full platform access: APM, infra, logs, synthetics, security",
      "Unlimited hosts and custom metrics during credit period",
    ],
    eligibility: "Series A or earlier, new to Datadog, affiliated with a Datadog partner VC or accelerator.",
    applyUrl: "https://www.datadoghq.com/partner/datadog-for-startups/",
    featured: false,
  },
  {
    slug: "sentry",
    name: "Sentry",
    tagline: "Error tracking and performance monitoring for engineers",
    description:
      "Sentry captures frontend and backend errors in real time, shows you the exact stack trace, and lets your team triage and resolve bugs fast. Startup credits give you access to the full platform so nothing slips through the cracks as you ship quickly.",
    category: "Developer Tools",
    deal: "4–12 months free (via partner programs)",
    dealType: "free-plan",
    whatYouGet: [
      "4–12 months free depending on partner affiliation",
      "Error monitoring, performance tracing, and session replays",
      "Source maps and release tracking",
      "Available via AWS Activate, direct sales, or accelerator partnerships",
    ],
    eligibility: "Early-stage startups. Best accessed via AWS Activate bundle or direct outreach to Sentry.",
    applyUrl: "https://sentry.io/for/startups/",
    featured: false,
  },

  // ── Productivity ──────────────────────────────────────────────────────────
  {
    slug: "notion-for-startups",
    name: "Notion for Startups",
    tagline: "Docs, wikis, databases, and project management in one",
    description:
      "Notion is the all-in-one workspace most startup teams use for their internal wiki, roadmap, meeting notes, OKRs, and CRM. The startup program gives you Business Plan (including Notion AI) for free — no need to pay until you scale.",
    category: "Productivity",
    deal: "Up to 6 months free Business Plan (includes Notion AI)",
    dealType: "free-plan",
    whatYouGet: [
      "6 months free for partner-affiliated startups",
      "3 months free for non-partner startups",
      "Business Plan includes unlimited blocks, guests, and version history",
      "Notion AI included",
    ],
    eligibility: "Startups less than 3 years old, under $8M raised. Partner-affiliated startups get 6 months; others get 3.",
    applyUrl: "https://www.notion.com/startups",
    featured: false,
  },
  {
    slug: "linear",
    name: "Linear",
    tagline: "Fast, opinionated project management for engineering teams",
    description:
      "Linear is the issue tracker and project management tool that engineering teams actually love using. It's fast, keyboard-driven, and built for software teams — with cycles, roadmaps, and GitHub/Slack integrations. The startup plan gives you months of free access.",
    category: "Productivity",
    deal: "Up to 6 months free",
    dealType: "free-plan",
    whatYouGet: [
      "Up to 6 months free on Basic or Business plans",
      "Unlimited members, projects, and integrations",
      "GitHub, Slack, Figma, and Sentry integrations",
      "Roadmaps and cycle planning",
    ],
    eligibility: "Early-stage startups affiliated with a Linear partner VC or accelerator.",
    applyUrl: "https://linear.app/startups",
    featured: false,
  },

  // ── CRM & Sales ───────────────────────────────────────────────────────────
  {
    slug: "hubspot-for-startups",
    name: "HubSpot for Startups",
    tagline: "CRM, marketing, sales, and customer service platform",
    description:
      "HubSpot is the all-in-one growth platform — free CRM, email marketing, sales pipeline, customer service ticketing, and operations tools. The startup program offers the steepest discounts in SaaS: 90% off in Year 1, making enterprise-grade CRM accessible from day one.",
    category: "CRM & Sales",
    deal: "90% off Year 1, 50% off Year 2, 25% off Year 3",
    dealType: "discount",
    whatYouGet: [
      "90% off for venture-funded startups in Year 1",
      "50% off in Year 2, 25% off in Year 3",
      "30%/15% for non-venture-backed startups",
      "Access to Marketing, Sales, Service, CMS, and Operations Hubs",
    ],
    eligibility: "Startups less than 2 years old, under $2M raised. Partner accelerator affiliation unlocks higher discounts.",
    applyUrl: "https://www.hubspot.com/startups",
    featured: true,
  },

  // ── AI & LLMs ─────────────────────────────────────────────────────────────
  {
    slug: "anthropic-for-startups",
    name: "Anthropic for Startups",
    tagline: "Claude API — the most capable AI model for complex tasks",
    description:
      "Anthropic's Claude models (Opus, Sonnet, Haiku) are known for nuanced reasoning, long-context handling, and safety. The startup program provides non-dilutive API credits so you can build AI-powered features without worrying about inference costs while you find product-market fit.",
    category: "AI & LLMs",
    deal: "$25,000–$100,000+ in Claude API credits",
    dealType: "credits",
    whatYouGet: [
      "$25,000–$100,000+ depending on stage and VC affiliation",
      "Access to Claude Opus, Sonnet, and Haiku models",
      "Non-dilutive — no equity required",
      "12-month validity on credits",
    ],
    eligibility: "Pre-seed to Series A. Partner-backed startups (top-tier VCs and accelerators) unlock higher tiers.",
    applyUrl: "https://www.anthropic.com/startup-program-official-terms",
    featured: true,
  },
  {
    slug: "openai-for-startups",
    name: "OpenAI for Startups",
    tagline: "GPT-4o and o-series models for your AI product",
    description:
      "OpenAI's startup program gives you API credits to build with GPT-4o, o1, and other models. For founders selected into OpenAI Grove (a cohort program), credits go up to $50,000 — plus access to OpenAI's team, events, and go-to-market support.",
    category: "AI & LLMs",
    deal: "Up to $5,000 (standard); up to $50,000 via Grove cohort",
    dealType: "credits",
    whatYouGet: [
      "$5,000 in API credits via standard program",
      "Up to $50,000 for OpenAI Grove cohort participants",
      "$25,000 via Codex Open Source Fund (open-source AI projects)",
      "$2,500 via Ramp partnership",
      "Credits expire 12 months from issuance",
    ],
    eligibility: "Venture-backed startups (pre-seed to Series A). Grove is a competitive cohort — apply early.",
    applyUrl: "https://openai.com/startups/",
    featured: true,
  },
  {
    slug: "mistral-for-startups",
    name: "Mistral AI for Startups",
    tagline: "European frontier AI models with strong multilingual support",
    description:
      "Mistral AI offers open-weight and proprietary models via La Plateforme, known for efficiency and strong multilingual performance. Their startup program provides substantial credits, and Mistral models are also available on AWS, Azure, and GCP — letting you stack platform credits.",
    category: "AI & LLMs",
    deal: "Up to €30,000 (~$32,000) in API credits",
    dealType: "credits",
    whatYouGet: [
      "Up to €30,000 in La Plateforme API credits",
      "Access to Mistral Large, Small, Codestral, and Pixtral",
      "Also available on AWS Bedrock, Azure AI, and GCP — stackable",
      "~10 startups selected per 6-month cohort",
    ],
    eligibility: "Pre-seed to Series A. Competitive cohort selection — approximately 10 startups per cycle.",
    applyUrl: "https://mistral.ai/news/la-plateforme/",
    featured: false,
  },
  {
    slug: "together-ai",
    name: "Together AI",
    tagline: "Open-source model inference with fine-tuning support",
    description:
      "Together AI specializes in fast, cost-effective inference for open-source models like Llama, Qwen, and Mistral — plus fine-tuning and dedicated endpoints. Their startup accelerator goes beyond credits to include engineering hours and GTM support.",
    category: "AI & LLMs",
    deal: "$15,000–$50,000 in credits + engineering support",
    dealType: "credits",
    whatYouGet: [
      "$15,000–$50,000 in inference credits based on stage",
      "Engineering support hours from Together AI team",
      "GTM and go-to-market assistance",
      "Access to serverless inference, fine-tuning, and dedicated endpoints",
    ],
    eligibility: "AI-native application startups. Competitive selection — apply through the Together AI Startup Accelerator.",
    applyUrl: "https://www.together.ai/startup-accelerator",
    featured: false,
  },
  {
    slug: "replicate",
    name: "Replicate for Startups",
    tagline: "Run open-source AI models via API",
    description:
      "Replicate lets you run open-source models — image generation (FLUX, SDXL), speech (Whisper), language (Llama), and more — via a simple API. No infrastructure to manage. Startup credits cover your initial compute costs while you prototype and ship.",
    category: "AI & LLMs",
    deal: "$1,000–$10,000 in inference credits",
    dealType: "credits",
    whatYouGet: [
      "$1,000–$10,000 in inference credits",
      "Access to 50,000+ public models on Replicate",
      "No VC referral required (bootstrapped startups eligible)",
      "3–14 business day review process",
    ],
    eligibility: "Bootstrapped, pre-seed, and seed startups. No investor affiliation required.",
    applyUrl: "https://replicate.com/startups",
    featured: false,
  },
  {
    slug: "hugging-face",
    name: "Hugging Face for Startups",
    tagline: "The GitHub of AI — models, datasets, and inference",
    description:
      "Hugging Face hosts 500,000+ models and datasets, provides inference endpoints, and is the hub of the open-source AI community. The startup program gives you Pro access — with private repos, inference credits, and priority support.",
    category: "AI & LLMs",
    deal: "6 months free Hugging Face Pro",
    dealType: "free-plan",
    whatYouGet: [
      "6 months free Hugging Face Pro subscription",
      "Private model repositories",
      "Inference API access",
      "Priority support from the HF team",
    ],
    eligibility: "Pre-seed, seed, and Series A startups globally.",
    applyUrl: "https://huggingface.co/startups",
    featured: false,
  },
  {
    slug: "perplexity-for-startups",
    name: "Perplexity for Startups",
    tagline: "AI-powered search and research engine with API",
    description:
      "Perplexity is an AI research and reasoning engine that answers questions with cited sources in real time — think of it as a smarter, faster search for your product. Their startup program includes both team access and API credits for building research-powered features.",
    category: "AI & LLMs",
    deal: "6 months free Enterprise Pro (50 seats) + $5,000 API credits",
    dealType: "free-plan",
    whatYouGet: [
      "6 months free Enterprise Pro for up to 50 team members",
      "$5,000 in Perplexity API credits",
      "Access to Sonar models for building AI search features",
      "Real-time web search grounding for your AI application",
    ],
    eligibility: "Companies less than 5 years old, raised no more than $20M, associated with approved Startup Partners.",
    applyUrl: "https://www.perplexity.ai/startups",
    featured: false,
  },
  {
    slug: "cohere-startups",
    name: "Cohere for Startups",
    tagline: "Enterprise AI models optimized for business NLP tasks",
    description:
      "Cohere offers frontier language models fine-tuned for enterprise use cases — document search, classification, summarization, and RAG pipelines. Strong choice for B2B startups building AI features for enterprise customers who need data privacy guarantees.",
    category: "AI & LLMs",
    deal: "Up to 25% off enterprise pricing",
    dealType: "discount",
    whatYouGet: [
      "Up to 25% discount on enterprise model pricing",
      "Access to Command, Embed, and Rerank models",
      "Grant access through Cohere Labs for research-focused startups",
      "Data privacy controls for enterprise deployment",
    ],
    eligibility: "Pre-seed through Series B startups building B2B AI products.",
    applyUrl: "https://cohere.com/startup-program",
    featured: false,
  },

  // ── AI Infrastructure ─────────────────────────────────────────────────────
  {
    slug: "pinecone",
    name: "Pinecone for Startups",
    tagline: "Managed vector database for AI applications",
    description:
      "Pinecone is the leading managed vector database — essential infrastructure for RAG pipelines, semantic search, recommendation systems, and long-term AI memory. Startup credits let you run production-scale vector search without upfront infra costs.",
    category: "AI Infrastructure",
    deal: "$5,000 in credits",
    dealType: "credits",
    whatYouGet: [
      "$5,000 in Pinecone platform credits",
      "Free Standard Tier access",
      "Pro Support included",
      "RBAC, backups, and Prometheus metrics",
      "7–10 business day review",
    ],
    eligibility: "Early-stage startups. Apply directly — no VC affiliation required.",
    applyUrl: "https://www.pinecone.io/startup-program/",
    featured: false,
  },
  {
    slug: "supabase-for-startups",
    name: "Supabase for Startups",
    tagline: "Open-source Firebase alternative with pgvector support",
    description:
      "Supabase is a backend-as-a-service built on PostgreSQL — with Auth, Storage, Edge Functions, and pgvector for AI embeddings. It's the go-to for startups that want Firebase-like speed of development with the power and reliability of Postgres.",
    category: "AI Infrastructure",
    deal: "Up to $3,000 in credits or 6 months free Team plan",
    dealType: "credits",
    whatYouGet: [
      "Up to $3,000 in platform credits (12-month validity) OR",
      "6 months free Team plan (~$3,600 value)",
      "Includes pgvector for AI embedding storage",
      "Auth, Storage, Realtime, and Edge Functions included",
      "No equity required",
    ],
    eligibility: "Less than 5 years old, under $5M total funding, affiliated with an approved VC or accelerator.",
    applyUrl: "https://supabase.com/solutions/startups",
    featured: false,
  },
  {
    slug: "vercel-for-startups",
    name: "Vercel for Startups",
    tagline: "Frontend cloud for shipping AI apps fast",
    description:
      "Vercel is the platform for deploying Next.js and modern web applications — with edge functions, AI SDK, v0 AI UI generation, and zero-config deployments. The startup program covers your hosting while you focus on building, not DevOps.",
    category: "AI Infrastructure",
    deal: "Free Pro plan + up to $30,000 in platform credits",
    dealType: "credits",
    whatYouGet: [
      "Free Vercel Pro plan",
      "Up to $30,000 in platform credits",
      "Access to v0 AI component generation tool",
      "Edge functions, image optimization, and analytics included",
    ],
    eligibility: "Early-stage startups. Apply through Vercel's startup page.",
    applyUrl: "https://vercel.com/startups/credits",
    featured: false,
  },
  {
    slug: "qdrant",
    name: "Qdrant for Startups",
    tagline: "High-performance open-source vector search engine",
    description:
      "Qdrant is an open-source vector database known for speed and filtering capabilities — especially useful for hybrid search (combining dense and sparse vectors). The startup program bundles Qdrant Cloud discounts with partner credits from Hugging Face and LlamaCloud.",
    category: "AI Infrastructure",
    deal: "20% off Qdrant Cloud for 12 months + partner credits",
    dealType: "discount",
    whatYouGet: [
      "20% discount on Qdrant Cloud for 12 months",
      "$100 in Hugging Face Hub compute credits",
      "20% discount on LlamaCloud",
      "Open-source self-hosted option always available",
    ],
    eligibility: "Open to all startups. Apply via the Qdrant website — 7–10 business day review.",
    applyUrl: "https://qdrant.tech/qdrant-for-startups/",
    featured: false,
  },

  // ── AI Coding ─────────────────────────────────────────────────────────────
  {
    slug: "cursor-for-startups",
    name: "Cursor for Startups",
    tagline: "AI-first code editor that writes and edits code with you",
    description:
      "Cursor is a VSCode fork with deep AI integration — it understands your entire codebase, writes multi-file edits, and can autonomously complete tasks. For early-stage engineering teams, Cursor dramatically accelerates development velocity.",
    category: "AI Coding",
    deal: "$500–$5,000+ in credits (via accelerator programs)",
    dealType: "credits",
    whatYouGet: [
      "$500–$5,000+ in Cursor Pro credits (varies by partner)",
      "Unlimited AI completions and chat during credit period",
      "Full codebase context (not just open files)",
      "Available through Y Combinator, Techstars, 500 Global, and others",
      "14-day free Pro trial available to all",
    ],
    eligibility: "Accelerator participants (YC, Techstars, 500 Global). Direct outreach available for other startups.",
    applyUrl: "https://cursor.com",
    featured: false,
  },

  {
    slug: "lovable",
    name: "Lovable",
    tagline: "Build full-stack web apps by describing them in plain English",
    description:
      "Lovable is an AI-powered app builder that turns natural language prompts into full-stack web applications — React frontend, Supabase backend, and deployable in minutes. Ideal for non-technical founders validating ideas fast, or technical founders who want to skip boilerplate entirely.",
    category: "AI Coding",
    deal: "Free tier available; startup credits via partner programs",
    dealType: "free-tier",
    whatYouGet: [
      "Free tier with limited monthly credits",
      "Full-stack app generation (React + Supabase)",
      "One-click deploy and custom domain support",
      "GitHub sync for code ownership",
      "Startup credits available through accelerator partnerships",
    ],
    eligibility: "Open to all. Startup discounts available via partner accelerators.",
    applyUrl: "https://lovable.dev",
    featured: true,
  },
  {
    slug: "emergent",
    name: "Emergent",
    tagline: "AI agent that builds, runs, and deploys full apps autonomously",
    description:
      "Emergent is an AI coding agent that can autonomously build complete web and mobile applications — not just code snippets, but working products with backend, frontend, and database wired together. Great for founders who want to go from idea to working prototype in hours.",
    category: "AI Coding",
    deal: "Free tier; startup access via emergent.sh",
    dealType: "free-tier",
    whatYouGet: [
      "Autonomous multi-file, full-stack app generation",
      "Supports web, mobile, and API backends",
      "Built-in preview and deployment",
      "Iterative editing via natural language",
      "Free tier available for prototyping",
    ],
    eligibility: "Open to all founders. Sign up directly at emergent.sh.",
    applyUrl: "https://emergent.sh",
    featured: true,
  },

  // ── AI Voice & Video ──────────────────────────────────────────────────────
  {
    slug: "elevenlabs",
    name: "ElevenLabs Startup Grants",
    tagline: "Realistic AI voice generation and text-to-speech API",
    description:
      "ElevenLabs produces the most realistic AI voices for text-to-speech, voice cloning, and dubbing. If your product involves audio — narration, voice assistants, accessibility features, or content localization — ElevenLabs grants give you access to 33 million characters free.",
    category: "AI Voice & Video",
    deal: "33M characters free (~$4,000 value, 680+ hours of audio)",
    dealType: "credits",
    whatYouGet: [
      "33 million characters of API credits (12-month validity)",
      "Equivalent to 680+ hours of generated audio",
      "Access to all voices including voice cloning",
      "No VC backing required — no investor deck needed",
      "5–10 business day review",
    ],
    eligibility: "Startups or companies with fewer than 25 employees. No investor requirement — bootstrapped startups eligible.",
    applyUrl: "https://elevenlabs.io/startup-grants",
    featured: true,
  },
  {
    slug: "runway-builders",
    name: "Runway Builders Program",
    tagline: "AI video generation and video editing API",
    description:
      "Runway builds Gen-3 and other AI video generation models. The Builders Program gives startups 500,000 API credits to integrate AI video generation into their products — ideal for media, content, edtech, or entertainment startups building video features.",
    category: "AI Voice & Video",
    deal: "500,000 API credits",
    dealType: "credits",
    whatYouGet: [
      "500,000 Runway API credits",
      "Access to Gen-3 Alpha, Act-One, and Characters API",
      "Available to seed through Series C startups",
      "Backed by Runway's $10M venture fund for top participants",
    ],
    eligibility: "Seed to Series C startups building video or media products. Competitive selection.",
    applyUrl: "https://runwayml.com/research/introducing-gen-3-alpha",
    featured: false,
  },

  // ── E-Commerce ───────────────────────────────────────────────────────────
  {
    slug: "shopify-for-startups",
    name: "Shopify for Startups",
    tagline: "The world's leading e-commerce platform",
    description:
      "Shopify powers over 2 million online stores globally. For startups selling physical or digital products, Shopify gives you storefronts, payments, inventory, shipping, and analytics out of the box. Their startup program offers discounted access for early-stage commerce businesses.",
    category: "E-Commerce",
    deal: "3 months free + 10% off first year",
    dealType: "discount",
    whatYouGet: [
      "3 months free on Shopify Basic, Shopify, or Advanced",
      "10% off for the first year on annual plans",
      "Access to 6,000+ apps in the Shopify App Store",
      "Shopify Payments (no third-party transaction fees)",
      "Point-of-sale (POS) hardware support",
    ],
    eligibility: "New Shopify accounts. Partner-affiliated startups may get extended trial periods.",
    applyUrl: "https://www.shopify.com/free-trial",
    featured: false,
  },
  {
    slug: "shiprocket",
    name: "Shiprocket",
    tagline: "India's leading e-commerce shipping and logistics platform",
    description:
      "Shiprocket aggregates 17+ courier partners (Blue Dart, Delhivery, FedEx, etc.) into one dashboard — with automated order sync, real-time tracking, NDR management, and competitive shipping rates. Essential for Indian D2C startups shipping across the country.",
    category: "E-Commerce",
    deal: "Free plan available; startup pricing on growth plans",
    dealType: "free-tier",
    whatYouGet: [
      "Free plan for low-volume shipping",
      "Access to 17+ courier partners with negotiated rates",
      "Automated order sync with Shopify, WooCommerce, Amazon",
      "Real-time shipment tracking and NDR management",
      "COD remittance and weight dispute resolution",
    ],
    eligibility: "Open to all Indian businesses. No minimum order volume on free plan.",
    applyUrl: "https://app.shiprocket.in/register",
    featured: false,
  },
  {
    slug: "dukaan",
    name: "Dukaan",
    tagline: "Launch your online store in 30 seconds",
    description:
      "Dukaan is an Indian-built e-commerce platform for setting up an online store instantly — no coding required. Includes catalogue management, payment collection, delivery tracking, and WhatsApp order notifications. Built specifically for Indian SMBs and D2C brands.",
    category: "E-Commerce",
    deal: "Free plan available",
    dealType: "free-tier",
    whatYouGet: [
      "Free plan with basic store features",
      "Custom domain and branded storefront",
      "Integrated payments (UPI, cards, wallets)",
      "WhatsApp order notifications",
      "Delivery partner integrations",
    ],
    eligibility: "Open to all. Free plan available with no setup fees.",
    applyUrl: "https://mydukaan.io",
    featured: false,
  },
  {
    slug: "gokwik",
    name: "GoKwik",
    tagline: "Checkout optimisation and RTO reduction for Indian D2C brands",
    description:
      "GoKwik is an Indian commerce enablement platform that improves checkout conversion rates and reduces Return-to-Origin (RTO) — one of the biggest pain points for Indian e-commerce startups. Uses AI to assess COD risk and streamline the buying experience.",
    category: "E-Commerce",
    deal: "Custom startup pricing; no upfront fee",
    dealType: null,
    whatYouGet: [
      "Smart checkout with pre-filled address and OTP-less login",
      "AI-powered COD risk scoring to reduce RTO",
      "Higher prepaid conversion nudges",
      "Works with Shopify, WooCommerce, and custom stores",
      "No upfront or monthly fee — success-based pricing",
    ],
    eligibility: "D2C brands and e-commerce startups in India. Revenue-share model — no upfront cost.",
    applyUrl: "https://gokwik.co",
    featured: false,
  },
  {
    slug: "unicommerce",
    name: "Unicommerce",
    tagline: "Multi-channel order and warehouse management for Indian e-commerce",
    description:
      "Unicommerce is India's leading SaaS platform for e-commerce operations — managing orders across marketplaces (Amazon, Flipkart, Meesho), warehouses, and D2C channels from a single dashboard. Essential for startups scaling across multiple selling channels.",
    category: "E-Commerce",
    deal: "Free trial available",
    dealType: "free-tier",
    whatYouGet: [
      "Centralized order management across 40+ sales channels",
      "Warehouse management system (WMS)",
      "Returns and exchange management",
      "Seller panel integrations for Amazon, Flipkart, Meesho, and more",
      "Real-time inventory sync across channels",
    ],
    eligibility: "Open to all e-commerce businesses. Free trial available.",
    applyUrl: "https://unicommerce.com",
    featured: false,
  },

  // ── Legal ─────────────────────────────────────────────────────────────────
  {
    slug: "stripe-atlas",
    name: "Stripe Atlas",
    tagline: "Incorporate in Delaware and get $50,000+ in startup perks",
    description:
      "Stripe Atlas lets you incorporate a Delaware C-corp or LLC online in days — ideal for Indian founders building global products who want US entity status for fundraising. Beyond incorporation, Atlas members get $50,000+ in partner perks from AWS, Mercury, Carta, and others.",
    category: "Legal",
    deal: "$2,500 in Stripe credits + $50,000+ in partner perks",
    dealType: "credits",
    whatYouGet: [
      "Delaware C-corp or LLC incorporation ($500 one-time fee)",
      "$2,500 in Stripe API credits",
      "$50,000+ in partner perks (AWS, Mercury, Carta, Notion, HubSpot)",
      "Free registered agent for 1 year",
      "Banking setup via Mercury (included in the flow)",
    ],
    eligibility: "Any founder globally. $500 incorporation fee applies. Partner perks unlock immediately after incorporation.",
    applyUrl: "https://stripe.com/atlas",
    featured: false,
  },
]

export function getResourceBySlug(slug: string): StartupResource | undefined {
  return resources.find((r) => r.slug === slug)
}

export function getResourcesByCategory(category: ResourceCategory): StartupResource[] {
  return resources.filter((r) => r.category === category)
}

export function getFeaturedResources(): StartupResource[] {
  return resources.filter((r) => r.featured)
}

const dealTypeColors: Record<DealType & string, string> = {
  credits: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  discount: "bg-mint/20 text-green-700 dark:text-green-400",
  "free-plan": "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  "free-tier": "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
}

export function getDealBadgeClass(dealType: DealType): string {
  if (!dealType) return "bg-ink/10 text-ink/50"
  return dealTypeColors[dealType] ?? "bg-ink/10 text-ink/50"
}
