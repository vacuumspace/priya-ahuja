export type OptionValue = 0 | 1 | 2

export type QuestionOption = {
  label: string
  sublabel?: string
  points: number
}

export type Question = {
  id: number
  text: string
  pillarIndex: number
  options: [QuestionOption, QuestionOption, QuestionOption]
  recommendationByOption: [string | null, string | null, string | null]
}

export type Pillar = {
  index: number
  title: string
  maxPoints: number
  questionIds: number[]
}

export type Answers = Record<number, OptionValue>

export const IDEA_PILLARS: Pillar[] = [
  { index: 0, title: "problem clarity",       maxPoints: 12, questionIds: [1,  2,  3,  4,  5,  6] },
  { index: 1, title: "founder-market fit",    maxPoints: 12, questionIds: [7,  8,  9,  10, 11, 12] },
  { index: 2, title: "demand signals",        maxPoints: 10, questionIds: [13, 14, 15, 16, 17] },
  { index: 3, title: "customer understanding",maxPoints: 12, questionIds: [18, 19, 20, 21, 22, 23] },
  { index: 4, title: "solution clarity",      maxPoints: 10, questionIds: [24, 25, 26, 27, 28] },
  { index: 5, title: "business basics",       maxPoints: 10, questionIds: [29, 30, 31, 32, 33] },
  { index: 6, title: "execution readiness",   maxPoints: 12, questionIds: [34, 35, 36, 37, 38, 39] },
  { index: 7, title: "build mindset",         maxPoints: 10, questionIds: [40, 41, 42, 43, 44] },
  { index: 8, title: "risk awareness",        maxPoints: 12, questionIds: [45, 46, 47, 48, 49, 50] },
]

export const IDEA_QUESTIONS: Question[] = [

  // ─── Segment 0: Problem Clarity ────────────────────────────────────────────
  {
    id: 1,
    text: "can you write the exact problem you're solving in one sentence - without jargon?",
    pillarIndex: 0,
    options: [
      { label: "not yet",             sublabel: "still working on articulating it clearly",              points: 0 },
      { label: "somewhat",            sublabel: "i can explain it but it needs context",                 points: 1 },
      { label: "yes, crisp and clear", sublabel: "one sentence, anyone understands it instantly",       points: 2 },
    ],
    recommendationByOption: [
      "If you can't write the problem in one sentence, you don't understand it well enough yet. Write 10 versions. Show them to people who don't know your idea. Use the version they react to most strongly.",
      "A problem statement that needs context is too complex. Keep simplifying until a 12-year-old understands the pain. If you have to explain the industry first, start over.",
      null,
    ],
  },
  {
    id: 2,
    text: "how often does your target user experience this problem?",
    pillarIndex: 0,
    options: [
      { label: "rarely",           sublabel: "once a month or less",                         points: 0 },
      { label: "occasionally",     sublabel: "a few times a week",                           points: 1 },
      { label: "daily friction",   sublabel: "it interrupts their workflow constantly",      points: 2 },
    ],
    recommendationByOption: [
      "Infrequent problems are very hard to build habits around. Ask: what's the version of this problem that's annoying every single week? That's your starting point.",
      "Weekly pain is workable, but daily friction is the sweet spot. Find the trigger moment - when exactly does the problem hit? That's where your product hooks.",
      null,
    ],
  },
  {
    id: 3,
    text: "what are people currently doing to deal with this problem?",
    pillarIndex: 0,
    options: [
      { label: "nothing, they ignore it",  sublabel: "people just live with it",                             points: 0 },
      { label: "manual workarounds",       sublabel: "spreadsheets, WhatsApp, jugaad",                       points: 1 },
      { label: "paying for bad solutions", sublabel: "spending money on something that barely works",        points: 2 },
    ],
    recommendationByOption: [
      "If people ignore the problem, that's a signal it's not painful enough. Find the version where they actively try to solve it - that's the real problem.",
      "Manual workarounds are gold - they prove the pain is real. List every workaround your users have built. Each one is a feature idea and a proof point.",
      null,
    ],
  },
  {
    id: 4,
    text: "how much does this problem cost your users (time, money, or missed opportunity)?",
    pillarIndex: 0,
    options: [
      { label: "minor inconvenience",        sublabel: "annoying but no real cost",                          points: 0 },
      { label: "notable but tolerable",      sublabel: "costs time or some money regularly",                 points: 1 },
      { label: "significant and measurable", sublabel: "quantifiable loss of money, time, or opportunity",   points: 2 },
    ],
    recommendationByOption: [
      "If the cost is trivial, users won't pay to fix it. Reframe the problem around the consequence, not the symptom - what does it lead to if unsolved?",
      "Can you quantify the cost? '3 hours a week × 50 weeks = 150 hours' is more compelling than 'takes too long.' Make the cost concrete.",
      null,
    ],
  },
  {
    id: 5,
    text: "is the problem getting worse, staying the same, or improving on its own?",
    pillarIndex: 0,
    options: [
      { label: "improving on its own",  sublabel: "the market is slowly solving it without you",             points: 0 },
      { label: "staying the same",      sublabel: "persistent but not intensifying",                         points: 1 },
      { label: "getting worse",         sublabel: "a trend, regulation, or behaviour change is amplifying it", points: 2 },
    ],
    recommendationByOption: [
      "If the market is already solving the problem, your window is closing. Either move faster or find the version of the problem that isn't being solved.",
      "Static pain is real but less urgent. Look for the trigger that makes it suddenly worse - legislation, new tech, population shift. A tailwind makes your timing argument far stronger.",
      null,
    ],
  },
  {
    id: 6,
    text: "have you personally experienced this problem, or are you building for someone else's pain?",
    pillarIndex: 0,
    options: [
      { label: "observed it from outside",  sublabel: "spotted it but never lived it",                        points: 0 },
      { label: "adjacent experience",       sublabel: "worked in the space, felt something related",          points: 1 },
      { label: "lived it directly",         sublabel: "had this exact problem and couldn't find a solution",  points: 2 },
    ],
    recommendationByOption: [
      "Building for pain you've never felt is high risk. You'll miss nuance, misread signals, and run out of conviction when it gets hard. Spend 60 days embedded with your target user before writing code.",
      "Adjacent experience is useful but not enough. Find 3–5 users who have the exact problem and make them your design partners. Their frustration is your north star.",
      null,
    ],
  },

  // ─── Segment 1: Founder-Market Fit ─────────────────────────────────────────
  {
    id: 7,
    text: "why are you the right person to build this - what makes your background relevant?",
    pillarIndex: 1,
    options: [
      { label: "no specific reason",     sublabel: "i just think it's a good idea",                         points: 0 },
      { label: "general relevance",      sublabel: "my skills are useful but not specific to this problem",  points: 1 },
      { label: "clear unfair advantage", sublabel: "my background, network, or experience gives me an edge nobody else has", points: 2 },
    ],
    recommendationByOption: [
      "Anyone building this with no particular advantage will be easily displaced. Write down exactly why a customer should work with you over someone with more experience. If you can't, that's your gap.",
      "General relevance isn't enough in a crowded space. Define the one thing you know, have, or can do that a well-funded outsider would take 2 years to replicate.",
      null,
    ],
  },
  {
    id: 8,
    text: "how deep is your understanding of this industry or domain?",
    pillarIndex: 1,
    options: [
      { label: "surface level",    sublabel: "based on research and reading, not doing",               points: 0 },
      { label: "working knowledge", sublabel: "spent time in the industry or with people in it",      points: 1 },
      { label: "deep expertise",   sublabel: "years of hands-on experience, know where the bodies are", points: 2 },
    ],
    recommendationByOption: [
      "Surface-level knowledge leads to solving the wrong version of the problem. Do 60 days of immersion: shadow professionals, take a job, consult - before building.",
      "Working knowledge is a start. Find one 'industry insider' advisor who can stress-test every assumption you have. What you don't know is what will kill you.",
      null,
    ],
  },
  {
    id: 9,
    text: "do you have direct, existing access to your first 10 potential users - people you could call today?",
    pillarIndex: 1,
    options: [
      { label: "no",                       sublabel: "i don't know how to reach them yet",              points: 0 },
      { label: "one or two connections",   sublabel: "know a few people in the space",                  points: 1 },
      { label: "yes, right now",           sublabel: "i can message 10 people today who have this pain", points: 2 },
    ],
    recommendationByOption: [
      "No access to users is a red flag. Before building anything, answer this: how would you get in a room with 10 people who have this problem? That answer is also your distribution strategy.",
      "One or two connections gives you a start. Ask each of them: 'Who else should I talk to about this?' The second-degree network is usually warmer than cold outreach.",
      null,
    ],
  },
  {
    id: 10,
    text: "how long are you genuinely willing to commit to this before expecting a meaningful result?",
    pillarIndex: 1,
    options: [
      { label: "less than 6 months",  sublabel: "expecting to see traction quickly",             points: 0 },
      { label: "6–18 months",         sublabel: "willing to give it real time",                  points: 1 },
      { label: "3+ years if needed",  sublabel: "this is a long game and i'm okay with that",   points: 2 },
    ],
    recommendationByOption: [
      "6 months is not enough time to build, test, fail, and find traction. Most successful startups take 18–36 months to find product-market fit. If your timeline is short, either the idea needs to be simpler or your expectations need adjusting.",
      "18 months is realistic for an early signal but not for a business. The founders who win are usually the ones who outlast everyone else. Are you building something you'd still care about in year 3?",
      null,
    ],
  },
  {
    id: 11,
    text: "what is the honest reason you want to build this - mission, problem obsession, or business opportunity?",
    pillarIndex: 1,
    options: [
      { label: "mainly the business case",     sublabel: "i see a market gap, not a passion",             points: 0 },
      { label: "mix of both",                  sublabel: "i like the problem and think it's a business",  points: 1 },
      { label: "obsessed with the problem",    sublabel: "i'd work on this even if it weren't lucrative", points: 2 },
    ],
    recommendationByOption: [
      "Business-opportunity founders are common and often quit when it gets hard. Ask: what will keep you working on this at 11pm after 3 bad months? If it's just the upside, build a different business.",
      "Mixed motivation is honest. The test is: when the business case weakens (and it will at some point), does the problem still pull you? That's your real answer.",
      null,
    ],
  },
  {
    id: 12,
    text: "do you have any structural unfair advantages - network, knowledge, trust, or access?",
    pillarIndex: 1,
    options: [
      { label: "none that i can identify",  sublabel: "starting on a level playing field",                   points: 0 },
      { label: "one advantage",             sublabel: "a useful network, skill, or relationship",            points: 1 },
      { label: "multiple stacked",          sublabel: "two or more advantages that compound each other",     points: 2 },
    ],
    recommendationByOption: [
      "No unfair advantage means you're competing on speed and luck alone. List 10 things you know, have, or can do that took years to build. One of those is probably your advantage - look harder.",
      "One advantage is enough to start. But identify how to build a second: your first advantage gets you in the room; the second makes you win the room.",
      null,
    ],
  },

  // ─── Segment 2: Demand Signals ──────────────────────────────────────────────
  {
    id: 13,
    text: "are people already spending money - or significant time - on partial solutions to this problem?",
    pillarIndex: 2,
    options: [
      { label: "no, they're not spending",     sublabel: "people tolerate the problem without paying",            points: 0 },
      { label: "time, not money",              sublabel: "people build workarounds but don't pay for solutions",  points: 1 },
      { label: "yes, paying for bad options",  sublabel: "money is flowing to imperfect solutions already",      points: 2 },
    ],
    recommendationByOption: [
      "No spending means no validated market yet. Find the single thing in this space people do pay for - even tangentially. That's where willingness to pay exists.",
      "Workarounds prove pain but not willingness to pay. Your job is to convert their time cost into a money argument: 'You're spending 5 hours a week; what's your time worth?'",
      null,
    ],
  },
  {
    id: 14,
    text: "when you describe the problem to strangers (not friends), what's their reaction?",
    pillarIndex: 2,
    options: [
      { label: "polite but blank",      sublabel: "they nod but don't lean in",                          points: 0 },
      { label: "recognition",           sublabel: "'yes, that is annoying' - they get it",               points: 1 },
      { label: "visceral reaction",     sublabel: "'oh god yes, i hate that' - they feel it physically", points: 2 },
    ],
    recommendationByOption: [
      "If strangers aren't engaged, the problem isn't resonant enough. Either your description is off, or the problem isn't as universal as you think. Reframe and test again with 10 new people.",
      "Recognition is a good signal. Now find the version of the story that gets the visceral reaction - there's usually a more specific, more painful version hiding inside the general one.",
      null,
    ],
  },
  {
    id: 15,
    text: "is there an online community, forum, or group where people actively discuss this problem?",
    pillarIndex: 2,
    options: [
      { label: "not that i've found",   sublabel: "no community around this pain",                        points: 0 },
      { label: "a small one",           sublabel: "some discussion but scattered",                        points: 1 },
      { label: "an active community",   sublabel: "a subreddit, WhatsApp group, or forum that's alive",  points: 2 },
    ],
    recommendationByOption: [
      "No community is a warning sign. Either the pain isn't strong enough for people to seek others, or you're looking in the wrong place. Try Reddit, LinkedIn groups, Quora, and niche Slack communities.",
      "A small community is enough to start. Join it, listen for 2 weeks before saying anything, then identify the 3 most common complaints. Those are your first features.",
      null,
    ],
  },
  {
    id: 16,
    text: "how hard was it to find your first 5 potential users to talk to?",
    pillarIndex: 2,
    options: [
      { label: "very hard",    sublabel: "struggled to find even one person",                    points: 0 },
      { label: "took effort",  sublabel: "had to search carefully but found them eventually",    points: 1 },
      { label: "very easy",    sublabel: "found 5 people in under a day",                        points: 2 },
    ],
    recommendationByOption: [
      "Struggling to find users is itself a signal - if people are hard to find, they're hard to reach as customers too. Your distribution problem starts here.",
      "Took effort is normal. Now map where you found them. That's your first distribution channel - go deeper on the one that worked.",
      null,
    ],
  },
  {
    id: 17,
    text: "have people ever come to you with this problem, or asked you to build something like this?",
    pillarIndex: 2,
    options: [
      { label: "no, never",           sublabel: "this idea came entirely from me",                       points: 0 },
      { label: "one or two people",   sublabel: "a couple of people mentioned something similar",        points: 1 },
      { label: "multiple people",     sublabel: "i keep hearing this from different people unprompted",  points: 2 },
    ],
    recommendationByOption: [
      "Nobody asking is a red flag. It doesn't mean the idea is bad, but it means you have more validation work to do. Go describe the problem to 20 people and see who raises their hand.",
      "One or two is a signal but not enough. Find out if those people also know others with the same problem. One reference customer can open a whole network.",
      null,
    ],
  },

  // ─── Segment 3: Customer Understanding ─────────────────────────────────────
  {
    id: 18,
    text: "can you describe your first target customer in precise detail - role, daily routine, goal, and frustration?",
    pillarIndex: 3,
    options: [
      { label: "broad description",   sublabel: "'small business owners' or 'busy professionals'",        points: 0 },
      { label: "decent specificity",  sublabel: "i know the job title and some pain points",              points: 1 },
      { label: "very specific",       sublabel: "i can describe a real person - what they do each morning, what they hate, what they want", points: 2 },
    ],
    recommendationByOption: [
      "'Small business owners' is not a customer. Pick one: a 35-year-old solo CA in Pune managing 40 SME clients, hates following up on GST documents. Specificity is what makes marketing work.",
      "Job title + pain is a start. Now add: what does their day look like? What do they do before they look for a solution? What would make them say yes in 10 seconds?",
      null,
    ],
  },
  {
    id: 19,
    text: "what is the specific trigger that makes your target customer start looking for a solution?",
    pillarIndex: 3,
    options: [
      { label: "not sure",          sublabel: "haven't mapped the trigger moment",                      points: 0 },
      { label: "have a theory",     sublabel: "i think i know but haven't confirmed it with users",    points: 1 },
      { label: "confirmed it",      sublabel: "i've heard this exact moment described by multiple users", points: 2 },
    ],
    recommendationByOption: [
      "Without knowing the trigger, you can't write copy, run ads, or design onboarding. Ask 5 users: 'Tell me about the last time you felt frustrated by this. What were you doing right before?' The trigger is in the answer.",
      "A theory is good - test it. Ask 5 users to walk you through what happened right before they searched for a solution. If your theory is right 3 out of 5 times, it's confirmed.",
      null,
    ],
  },
  {
    id: 20,
    text: "what have your target users already tried that didn't work - and why exactly did it fail them?",
    pillarIndex: 3,
    options: [
      { label: "haven't asked",          sublabel: "don't know what they've tried before",                   points: 0 },
      { label: "know the options",       sublabel: "aware of existing solutions but not why they fail",      points: 1 },
      { label: "know the failure points", sublabel: "users told me exactly where current solutions break",   points: 2 },
    ],
    recommendationByOption: [
      "Not knowing what users tried is a critical gap. This is your competitive positioning waiting to be discovered. Ask: 'What did you try before? Why did you stop using it?' Every answer is a feature.",
      "Knowing solutions exist but not why they fail means your differentiation is a guess. The 'why it fails' is your wedge. Find it in 5 interviews this week.",
      null,
    ],
  },
  {
    id: 21,
    text: "how do your target users currently make decisions about buying new tools or solutions?",
    pillarIndex: 3,
    options: [
      { label: "no idea",              sublabel: "haven't thought about their buying process",            points: 0 },
      { label: "general sense",        sublabel: "assume they compare options and pick the best one",     points: 1 },
      { label: "know it specifically", sublabel: "know who approves, how long it takes, and what they need to say yes", points: 2 },
    ],
    recommendationByOption: [
      "Not understanding the buying process means your GTM will be guesswork. Ask: 'How did you buy the last tool you use for this?' The answer shapes your entire sales approach.",
      "Assuming a rational comparison process is usually wrong. Ask users: 'Who else needed to sign off? How long did it take? What would have killed the decision?' The process is rarely clean.",
      null,
    ],
  },
  {
    id: 22,
    text: "do you know where your target customers spend time online - communities, newsletters, influencers they follow?",
    pillarIndex: 3,
    options: [
      { label: "no idea",         sublabel: "haven't mapped their online behaviour",                      points: 0 },
      { label: "rough sense",     sublabel: "know the general platforms but not the specific watering holes", points: 1 },
      { label: "specific places", sublabel: "know the exact subreddits, newsletters, accounts they follow", points: 2 },
    ],
    recommendationByOption: [
      "Not knowing where users live online means you can't reach them without paid ads. Find 3 people in your target segment and ask: 'What do you read every morning? Who do you follow in this space?'",
      "General platforms aren't enough. LinkedIn is 800M people - that's not a targeting strategy. Find the specific sub-communities: niche newsletters, Slack groups, local WhatsApp groups.",
      null,
    ],
  },
  {
    id: 23,
    text: "how many customer discovery conversations have you had with people you don't know personally?",
    pillarIndex: 3,
    options: [
      { label: "fewer than 5",  sublabel: "mostly talked to friends or colleagues",     points: 0 },
      { label: "5–15",          sublabel: "a reasonable sample but still limited",      points: 1 },
      { label: "20 or more",    sublabel: "large enough that patterns are emerging",    points: 2 },
    ],
    recommendationByOption: [
      "Friends give you comfort, not insight. Their politeness biases every answer. Do 10 cold discovery calls this week - the discomfort of cold outreach is the point.",
      "5–15 is progress but not enough for patterns. You need 20+ before you can trust a theme. Who said something that surprised you? Go find 10 more people like them.",
      null,
    ],
  },

  // ─── Segment 4: Solution Clarity ────────────────────────────────────────────
  {
    id: 24,
    text: "can you explain your solution in one sentence - without using 'platform,' 'ecosystem,' or 'AI-powered'?",
    pillarIndex: 4,
    options: [
      { label: "not yet",         sublabel: "still figuring out exactly what i'm building",               points: 0 },
      { label: "rough version",   sublabel: "can explain it but it's still a bit muddled",               points: 1 },
      { label: "crystal clear",   sublabel: "anyone understands it in 10 seconds, no jargon needed",     points: 2 },
    ],
    recommendationByOption: [
      "If you can't explain it simply, you don't know what you're building yet. Write 10 one-sentence versions. Read them to 5 people outside tech. Use the one that makes them say 'oh, that's it.'",
      "Muddled explanations cost you customers at the top of the funnel. Every word of friction in your pitch is a reason for someone to move on. Edit until it hurts.",
      null,
    ],
  },
  {
    id: 25,
    text: "what is the smallest version of your solution that would be genuinely useful - not impressive, just useful?",
    pillarIndex: 4,
    options: [
      { label: "not sure yet",         sublabel: "haven't mapped minimum scope",                          points: 0 },
      { label: "have an idea",         sublabel: "think i know the MVP but haven't stress-tested it",    points: 1 },
      { label: "very clearly defined", sublabel: "can describe the exact v1 in 3 bullet points",        points: 2 },
    ],
    recommendationByOption: [
      "Without a clear MVP, you'll build too much. Write down every feature you want, then cross off anything that isn't required for the problem to be solved. Keep crossing until it hurts. That's your v1.",
      "An untested MVP idea is still an assumption. Write it out as a user story: 'A [user] can [do X] so that [problem is solved].' Now ask: is that actually enough? Or are you still assuming step 2?",
      null,
    ],
  },
  {
    id: 26,
    text: "what would make a new user say 'I get it' within the first 2 minutes of using your product?",
    pillarIndex: 4,
    options: [
      { label: "not mapped yet",       sublabel: "haven't thought about the aha moment",                  points: 0 },
      { label: "have a hypothesis",    sublabel: "think i know what it is but haven't tested it",        points: 1 },
      { label: "confirmed it",         sublabel: "users have told me exactly when they felt it click",   points: 2 },
    ],
    recommendationByOption: [
      "Without an aha moment, your product leaks users. Map it now: what's the one thing a new user needs to do or see to understand the value? Design the entire onboarding around reaching that moment.",
      "Test your hypothesis by watching 5 new users - don't explain anything. See if they hit the moment you predicted. If not, redesign. The aha moment is the most important part of your product.",
      null,
    ],
  },
  {
    id: 27,
    text: "what are you explicitly NOT building - and can you hold that boundary under pressure?",
    pillarIndex: 4,
    options: [
      { label: "haven't decided",        sublabel: "open to building whatever users want",                 points: 0 },
      { label: "have some guardrails",   sublabel: "roughly know what's out of scope but it's loose",    points: 1 },
      { label: "clear and firm",         sublabel: "have a defined scope and reasons for every exclusion", points: 2 },
    ],
    recommendationByOption: [
      "No boundaries mean feature creep by default. Write a 'not now' list: things users will ask for that you will say no to for the next 12 months. Every no protects your yes.",
      "Loose guardrails get bulldozed by the first enthusiastic user. Write the reason for each exclusion - 'not now because X' is much easier to defend than 'we just decided not to.'",
      null,
    ],
  },
  {
    id: 28,
    text: "can you build the first version with your current skills, team, and resources?",
    pillarIndex: 4,
    options: [
      { label: "no, major gaps",         sublabel: "need people or money i don't have before i can start", points: 0 },
      { label: "mostly, with some help", sublabel: "can build most of it, a few things to figure out",    points: 1 },
      { label: "yes, can start today",   sublabel: "the first version is buildable with what i have now", points: 2 },
    ],
    recommendationByOption: [
      "If you need everything to be in place before starting, you'll never start. Identify the single biggest gap. Is there a version of the MVP that sidesteps that gap entirely?",
      "Mostly-buildable is fine. Identify the one thing you can't do - is it a deal-breaker for the first version, or just a nice-to-have? Cut it from v1 and ship what you can.",
      null,
    ],
  },

  // ─── Segment 5: Business Basics ─────────────────────────────────────────────
  {
    id: 29,
    text: "can you describe a realistic way this makes money in the first year - not a future plan, but now?",
    pillarIndex: 5,
    options: [
      { label: "not sure yet",        sublabel: "will figure out monetisation later",                         points: 0 },
      { label: "rough idea",          sublabel: "have a monetisation concept but haven't tested it",         points: 1 },
      { label: "clear and near-term", sublabel: "know exactly how i'd charge and who'd pay, starting with first users", points: 2 },
    ],
    recommendationByOption: [
      "'We'll monetise later' is not a plan - it's a delay of a very hard problem. Write three ways you could charge for this today. Even if they're not scalable, they force you to think about value exchange.",
      "An untested monetisation idea is an assumption. The only test that counts is someone paying. What's the smallest thing you could charge for right now?",
      null,
    ],
  },
  {
    id: 30,
    text: "have you tested whether someone would pay for this - even in rough, unfinished form?",
    pillarIndex: 5,
    options: [
      { label: "no",               sublabel: "haven't asked anyone to pay",               points: 0 },
      { label: "verbal yes",       sublabel: "people said they'd pay but haven't",        points: 1 },
      { label: "real money",       sublabel: "at least one person has paid something",    points: 2 },
    ],
    recommendationByOption: [
      "An untested willingness to pay is the single most dangerous assumption in early startups. Ask 5 users: 'Would you pay ₹X for this right now?' If yes, collect the money. If not, find out why.",
      "Verbal yes is worth nothing - it's polite, not committed. Ask the person who said yes to pay ₹500 upfront for early access. That conversation teaches you more than 50 surveys.",
      null,
    ],
  },
  {
    id: 31,
    text: "what's your rough estimate of what one customer is worth per year (even a very rough number)?",
    pillarIndex: 5,
    options: [
      { label: "no estimate",       sublabel: "haven't thought about annual value per customer",    points: 0 },
      { label: "rough guess",       sublabel: "have an intuition but it's based on nothing solid",  points: 1 },
      { label: "grounded estimate", sublabel: "anchored in what similar tools charge or what users have indicated", points: 2 },
    ],
    recommendationByOption: [
      "Not knowing annual value per customer means you can't plan anything - marketing spend, team size, or growth targets. Research what similar tools charge. That's your starting anchor.",
      "Intuition-based estimates are usually off by 3–5x. Research 3 comparable products, look at their pricing, and triangulate. Your estimate should be defensible in a 1-minute explanation.",
      null,
    ],
  },
  {
    id: 32,
    text: "can you get your first customer without spending money on marketing?",
    pillarIndex: 5,
    options: [
      { label: "no, i'd need to advertise",  sublabel: "no organic path to first users",                   points: 0 },
      { label: "maybe, with effort",         sublabel: "some warm leads but it would require real work",   points: 1 },
      { label: "yes, have a clear path",     sublabel: "know exactly who my first customer is and how to reach them", points: 2 },
    ],
    recommendationByOption: [
      "If you need ads to get your first customer, you don't have a product yet - you have a hypothesis. Your first 10 customers should come from direct outreach, not paid channels. Find them manually.",
      "Warm effort is fine. Write down the exact names of the first 5 people you'd approach and what you'd say to each. The act of writing names forces clarity that 'I'll reach out to my network' never does.",
      null,
    ],
  },
  {
    id: 33,
    text: "is there a natural expansion path - more usage within the same customer, or adjacent use cases?",
    pillarIndex: 5,
    options: [
      { label: "not obvious",         sublabel: "it feels like a one-time or one-size product",            points: 0 },
      { label: "some expansion",      sublabel: "i can see a v2 but haven't mapped it clearly",            points: 1 },
      { label: "clear expansion path", sublabel: "every customer naturally grows or opens a new segment", points: 2 },
    ],
    recommendationByOption: [
      "A one-time product isn't a business, it's a feature. Map how a happy customer would use you more over time: more seats, more data, more modules. If there's no path, revisit the model.",
      "A v2 you haven't mapped is a hope, not a plan. Sketch the expansion: what does a customer look like after 12 months of using you? What new problem do they have then that you could solve?",
      null,
    ],
  },

  // ─── Segment 6: Execution Readiness ─────────────────────────────────────────
  {
    id: 34,
    text: "do you know exactly what you'd work on in the first 30 days?",
    pillarIndex: 6,
    options: [
      { label: "vague direction",   sublabel: "know the general area but not the specific actions",     points: 0 },
      { label: "some clarity",      sublabel: "have a rough to-do list but no clear priorities",        points: 1 },
      { label: "clear first 30 days", sublabel: "can name the 3 most important things to do next week", points: 2 },
    ],
    recommendationByOption: [
      "Vague direction leads to busy work, not progress. Write down the single most important thing you could do this week to reduce your biggest risk. Start there, not with the logo.",
      "A rough to-do list hides priority conflicts. Rank your list by 'which of these would most change what I do next?' The top answer is your only priority.",
      null,
    ],
  },
  {
    id: 35,
    text: "can you build a usable first version in under 8 weeks?",
    pillarIndex: 6,
    options: [
      { label: "no, it would take longer",   sublabel: "the v1 i'm imagining is too complex for 8 weeks",  points: 0 },
      { label: "maybe, with cuts",           sublabel: "if i cut scope aggressively, possibly",            points: 1 },
      { label: "yes, absolutely",            sublabel: "i know exactly what to build and it fits in 8 weeks", points: 2 },
    ],
    recommendationByOption: [
      "If your v1 takes longer than 8 weeks, it's too big. Cut until it's painful. The thing you cut is almost always a nice-to-have, not a need-to-have. Prove the core works first.",
      "If cutting scope makes 8 weeks possible, cut the scope. A smaller thing shipped in 8 weeks teaches you infinitely more than a bigger thing shipped in 6 months.",
      null,
    ],
  },
  {
    id: 36,
    text: "have you tested your single most dangerous assumption before starting to build?",
    pillarIndex: 6,
    options: [
      { label: "no",              sublabel: "building on unvalidated assumptions",                      points: 0 },
      { label: "partially",       sublabel: "tested some things but the biggest assumption is still open", points: 1 },
      { label: "yes",             sublabel: "the biggest risk has been tested, even if imperfectly",    points: 2 },
    ],
    recommendationByOption: [
      "Building on untested assumptions is the most expensive mistake in startups. Write your top 3 assumptions. Rank them by 'if this is wrong, everything falls apart.' Test the top one first, before anything else.",
      "Partial testing is progress. Identify the one assumption you haven't tested that would kill the idea if wrong. Build the cheapest possible test for it - no code needed.",
      null,
    ],
  },
  {
    id: 37,
    text: "do you have direct access to your first 10 users right now - people you could share a working version with today?",
    pillarIndex: 6,
    options: [
      { label: "no",                    sublabel: "haven't built a user pipeline yet",                   points: 0 },
      { label: "a few people",          sublabel: "have 2–3 people who might try it",                    points: 1 },
      { label: "yes, a committed group", sublabel: "10+ people have agreed to try the first version",   points: 2 },
    ],
    recommendationByOption: [
      "No users waiting means you'll build in a vacuum and ship into silence. Before writing a line of code, get 10 people to sign up to try v1. Even a waiting list validates interest.",
      "2–3 is a start but too fragile. If one person loses interest, you've lost 33% of your feedback loop. Get to 10 committed testers before you start building.",
      null,
    ],
  },
  {
    id: 38,
    text: "does your current life situation - time, money, other commitments - allow you to seriously pursue this?",
    pillarIndex: 6,
    options: [
      { label: "no, significant constraints",  sublabel: "full-time job, family pressure, or financial stress blocking this",  points: 0 },
      { label: "it's tight but possible",      sublabel: "have some time but it requires real sacrifice",                      points: 1 },
      { label: "yes, i have the runway",       sublabel: "have the time, financial buffer, and headspace to commit",          points: 2 },
    ],
    recommendationByOption: [
      "Significant constraints don't disqualify you, but they do shape your approach. Map the minimum viable commitment: how many hours a week can you actually give? Design your first 30 days around that number, not around what you wish you had.",
      "Tight is workable if you're honest about it. The mistake is treating constrained time like unconstrained time. Pick one thing and say no to everything else.",
      null,
    ],
  },
  {
    id: 39,
    text: "do you have one specific person you can ship the first version to and watch them use it in real time?",
    pillarIndex: 6,
    options: [
      { label: "no",                sublabel: "no specific person in mind",                                      points: 0 },
      { label: "someone vague",     sublabel: "have a type of person in mind but not a specific individual",    points: 1 },
      { label: "yes, one person",   sublabel: "have a name, can reach them today, and they're willing",        points: 2 },
    ],
    recommendationByOption: [
      "Building without a specific person to build for is how you end up building for nobody. Right now, write a name. If no name comes, that's your most important problem.",
      "A type is not a person. A type doesn't give you feedback, doesn't pay you, and doesn't refer others. Convert the type to a name - message one person in that category today.",
      null,
    ],
  },

  // ─── Segment 7: Build Mindset ────────────────────────────────────────────────
  {
    id: 40,
    text: "when you discover that a key assumption was wrong, what do you typically do?",
    pillarIndex: 7,
    options: [
      { label: "find reasons to keep going as planned",  sublabel: "look for why the data is wrong, not my assumption",    points: 0 },
      { label: "reassess and adjust",                    sublabel: "take it seriously and update the plan",                points: 1 },
      { label: "immediately act on it",                  sublabel: "treat it as the most important information i have",   points: 2 },
    ],
    recommendationByOption: [
      "Defending wrong assumptions is the most common way smart founders fail. The next time data contradicts your thesis, force yourself to write: 'If this data is correct, what does that mean for my plan?' Answer it honestly before responding.",
      "Reassessing is good. The difference between good and great is speed. The best founders change direction within 48 hours of a disconfirming signal, not 2 weeks later.",
      null,
    ],
  },
  {
    id: 41,
    text: "how comfortable are you shipping something imperfect to real users?",
    pillarIndex: 7,
    options: [
      { label: "very uncomfortable",   sublabel: "need it to be polished before showing anyone",              points: 0 },
      { label: "somewhat comfortable", sublabel: "can ship rough things to close contacts but not publicly", points: 1 },
      { label: "very comfortable",     sublabel: "prefer shipping and learning over perfecting before launch", points: 2 },
    ],
    recommendationByOption: [
      "Perfection before launch is how ideas stay ideas. Imperfect things shipped to real users generate more learning in 1 week than 3 months of internal refinement. Set a rule: if it solves the problem 70%, ship it.",
      "Shipping to close contacts is a start, but they're biased. The real learning comes from strangers. Find one person you don't know and share what you have this week. Their reaction is the real data.",
      null,
    ],
  },
  {
    id: 42,
    text: "have you talked to anyone who tried to build something similar and failed - and do you know why they failed?",
    pillarIndex: 7,
    options: [
      { label: "no",            sublabel: "haven't researched failed attempts",                           points: 0 },
      { label: "some research", sublabel: "aware of failed attempts but don't know why they failed",     points: 1 },
      { label: "yes, in depth", sublabel: "talked to people who tried it and know specifically why it failed", points: 2 },
    ],
    recommendationByOption: [
      "Not learning from failed attempts is a costly mistake. Search for 'startup graveyard' posts in your space. Find founders on LinkedIn who tried this. Buy them a coffee. The reasons they failed are the most valuable research you'll do.",
      "Knowing attempts failed but not why is incomplete. The 'why' is everything - did they run out of money, misread the customer, build the wrong thing? Find out. Each failure has a different lesson.",
      null,
    ],
  },
  {
    id: 43,
    text: "are you solving this problem because you love the problem, or because you love the solution you imagined?",
    pillarIndex: 7,
    options: [
      { label: "in love with my solution",   sublabel: "i have a specific thing i want to build",                    points: 0 },
      { label: "somewhere in between",       sublabel: "attached to the solution but open to changing it",          points: 1 },
      { label: "obsessed with the problem",  sublabel: "i don't care what the solution looks like, i want it solved", points: 2 },
    ],
    recommendationByOption: [
      "Solution attachment is how founders build things nobody wants. Your solution will change 3–4 times before you find what works. If you're attached to the form, every pivot will feel like a failure. Attach to the problem instead.",
      "Being somewhat open is better than rigid. The test: if a user told you a completely different approach would solve their problem better, would you build that instead? If the answer is hesitation, you're still solution-first.",
      null,
    ],
  },
  {
    id: 44,
    text: "how do you make decisions when you don't have enough information?",
    pillarIndex: 7,
    options: [
      { label: "wait for more information",  sublabel: "prefer to know more before deciding",                 points: 0 },
      { label: "make a decision with caveats", sublabel: "decide but keep options open",                     points: 1 },
      { label: "decide fast and test",        sublabel: "choose a direction, act, and update based on results", points: 2 },
    ],
    recommendationByOption: [
      "Waiting for perfect information in early-stage startups means never deciding. Most decisions can be reversed in 2 weeks. Set a rule: if a decision can be undone in 30 days, make it in 48 hours.",
      "Keeping options open is comfortable but costs time. Optionality is expensive in early startups - every 'maybe' is a distraction. Commit, and update only when you have actual evidence, not when you feel uncertain.",
      null,
    ],
  },

  // ─── Segment 8: Risk Awareness ───────────────────────────────────────────────
  {
    id: 45,
    text: "what is the single biggest reason this idea could fail - and is it something you can control?",
    pillarIndex: 8,
    options: [
      { label: "not sure what the biggest risk is",  sublabel: "haven't done a risk assessment",                    points: 0 },
      { label: "aware but not actively managing",   sublabel: "know the risk exists but hoping it works out",      points: 1 },
      { label: "identified and mitigating it",      sublabel: "biggest risk is known and has a specific plan",     points: 2 },
    ],
    recommendationByOption: [
      "Not knowing your biggest risk is itself the biggest risk. Do a 30-minute pre-mortem: write down every reason this could fail in 12 months. The one that comes up most is your #1 risk. Now ask: what can you do this week to reduce it?",
      "Hoping it works out is not a plan. Assign the risk an owner (probably you) and a deadline: 'I will have evidence by [date] that this risk is lower than I thought, or I will change direction.'",
      null,
    ],
  },
  {
    id: 46,
    text: "have you mapped what 6 months of this looking like failure would actually mean for you?",
    pillarIndex: 8,
    options: [
      { label: "no, haven't thought about it",   sublabel: "focusing only on success scenarios",                   points: 0 },
      { label: "rough idea",                     sublabel: "aware it could fail but haven't worked through it",   points: 1 },
      { label: "yes, clearly thought through",   sublabel: "know what failure looks like, its cost, and my next step", points: 2 },
    ],
    recommendationByOption: [
      "Founders who haven't mapped failure make irrational decisions to avoid it. Write down: if this doesn't work in 6 months, what have I lost (time, money, opportunity)? What's my next move? Making peace with the downside makes you a better decision-maker.",
      "Roughly aware isn't the same as prepared. Walk through the failure scenario in detail: what did you try, what didn't work, what did you learn? Knowing the failure path makes you more decisive, not less.",
      null,
    ],
  },
  {
    id: 47,
    text: "is there a cheaper or faster way to test your core hypothesis before committing fully to building?",
    pillarIndex: 8,
    options: [
      { label: "no, need to build to test",     sublabel: "can't validate without a real product",            points: 0 },
      { label: "maybe, thinking about it",      sublabel: "considering a lighter test but not sure how",      points: 1 },
      { label: "yes, have a clear test",        sublabel: "know how to test the core hypothesis in days, not months", points: 2 },
    ],
    recommendationByOption: [
      "Almost nothing requires building a full product to test. A landing page with a waitlist, a manual-behind-the-scenes demo, a paid consultation - each one tests the hypothesis faster than code. What's the cheapest way to find out if you're right?",
      "If you're thinking about a lighter test, stop thinking and design it. Write: what is the hypothesis? What evidence would prove it right? How do I get that evidence without writing code?",
      null,
    ],
  },
  {
    id: 48,
    text: "what happens if a well-funded competitor enters your space in the next 12 months?",
    pillarIndex: 8,
    options: [
      { label: "it would probably kill us",   sublabel: "no differentiation that would survive a well-funded entrant",  points: 0 },
      { label: "would be hard but survivable", sublabel: "some differentiation but it's not structural",               points: 1 },
      { label: "actually benefits us",        sublabel: "market validation helps, and our advantage isn't replicable with money", points: 2 },
    ],
    recommendationByOption: [
      "If money can kill your advantage, you don't have one yet. Identify the thing that a ₹50 crore competitor could not replicate in 18 months: it's usually user trust, proprietary data, or deep integrations. Build toward that.",
      "Survivable but hard is an unstable position. Build the differentiation before you need it. What would make your advantage structural? Start that work now, even if it takes 12 months to pay off.",
      null,
    ],
  },
  {
    id: 49,
    text: "have you identified any legal, regulatory, or ethical risks in your idea?",
    pillarIndex: 8,
    options: [
      { label: "no, haven't checked",           sublabel: "assumed it's fine",                                    points: 0 },
      { label: "checked, found nothing major",  sublabel: "did a basic check, no red flags",                    points: 1 },
      { label: "aware and have addressed",      sublabel: "know the risks and have a plan or have already cleared them", points: 2 },
    ],
    recommendationByOption: [
      "Assuming it's fine is a common mistake. Check: does your product touch money, health, children, data privacy, or professional services? If yes, get a 30-minute call with a lawyer before going further.",
      "A basic check is good. Now go one level deeper: if you have 10,000 users, what's the risk? Regulation often doesn't kick in until scale. Know where the line is.",
      null,
    ],
  },
  {
    id: 50,
    text: "do you have a clear, measurable definition of what 'this is working' looks like at 6 months?",
    pillarIndex: 8,
    options: [
      { label: "no clear metric",     sublabel: "will know it when i see it",                              points: 0 },
      { label: "rough targets",       sublabel: "have a sense of what good looks like, but not precise",  points: 1 },
      { label: "specific and written", sublabel: "have a written target: X users, Y revenue, Z retention by Month 6", points: 2 },
    ],
    recommendationByOption: [
      "'Know it when I see it' means you'll always find a reason to keep going or a reason to stop, both at the wrong time. Write one number: what would make you say 'this is working' at month 6? That's your north star.",
      "Rough targets drift. Write it down: a specific number, by a specific date, with a specific consequence if you hit it or miss it. Ambiguity is the enemy of decision-making.",
      null,
    ],
  },
]

export function computeIdeaPillarScores(answers: Answers): Record<number, { earned: number; max: number }> {
  return Object.fromEntries(
    IDEA_PILLARS.map((pillar) => {
      const earned = pillar.questionIds.reduce((sum, qId) => {
        const optIdx = answers[qId]
        if (optIdx === undefined) return sum
        const q = IDEA_QUESTIONS.find((q) => q.id === qId)!
        return sum + q.options[optIdx].points
      }, 0)
      return [pillar.index, { earned, max: pillar.maxPoints }]
    })
  )
}

export function computeIdeaTotal(answers: Answers): number {
  return IDEA_QUESTIONS.reduce((sum, q) => {
    const optIdx = answers[q.id]
    return optIdx !== undefined ? sum + q.options[optIdx].points : sum
  }, 0)
}

export function getIdeaTopRecommendations(answers: Answers, max = 3): string[] {
  return IDEA_QUESTIONS.flatMap((q) => {
    const optIdx = answers[q.id]
    if (optIdx === undefined) return []
    const rec = q.recommendationByOption[optIdx]
    if (!rec) return []
    const gap = q.options[2].points - q.options[optIdx].points
    return [{ rec, gap }]
  })
    .sort((a, b) => b.gap - a.gap)
    .slice(0, max)
    .map((x) => x.rec)
}
