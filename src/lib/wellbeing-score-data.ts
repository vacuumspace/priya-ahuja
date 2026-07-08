export type OptionValue = 0 | 1 | 2 | 3

export type QuestionOption = {
  label: string
  points: number
}

export type Question = {
  id: number
  text: string
  categoryIndex: number
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
  tipByOption: [string | null, string | null, string | null, string | null]
}

export type Category = {
  index: number
  title: string
  maxPoints: number
  questionIds: number[]
}

export type Answers = Record<number, OptionValue>

export const WELLBEING_CATEGORIES: Category[] = [
  { index: 0, title: "sleep & energy",          maxPoints: 15, questionIds: [1, 2, 3, 16, 17] },
  { index: 1, title: "stress & coping",         maxPoints: 15, questionIds: [4, 5, 6, 7, 18] },
  { index: 2, title: "relationships & support", maxPoints: 15, questionIds: [8, 9, 10, 19, 20] },
  { index: 3, title: "purpose & identity",      maxPoints: 15, questionIds: [11, 12, 13, 21, 22] },
  { index: 4, title: "financial anxiety",       maxPoints: 15, questionIds: [14, 15, 23, 24, 25] },
  { index: 5, title: "work-life boundaries",    maxPoints: 15, questionIds: [26, 27, 28, 29, 30] },
  { index: 6, title: "physical health",         maxPoints: 15, questionIds: [31, 32, 33, 34, 35] },
  { index: 7, title: "emotional regulation",    maxPoints: 15, questionIds: [36, 37, 38, 39, 40] },
  { index: 8, title: "leadership & team pressure", maxPoints: 15, questionIds: [41, 42, 43, 44, 45] },
  { index: 9, title: "hope & future outlook",   maxPoints: 15, questionIds: [46, 47, 48, 49, 50] },
]

export const WELLBEING_QUESTIONS: Question[] = [
  // ── Sleep & Energy ──────────────────────────────────────────────────────
  {
    id: 1,
    text: "how many hours of sleep do you average on a work night?",
    categoryIndex: 0,
    options: [
      { label: "less than 5 hours", points: 0 },
      { label: "5-6 hours", points: 1 },
      { label: "6-7 hours", points: 2 },
      { label: "7+ hours, fairly consistent", points: 3 },
    ],
    tipByOption: [
      "under 5 hours a night is a burnout accelerant, not a badge of honour. protect one non-negotiable sleep block this week.",
      "5-6 hours is survivable short-term but compounds fast. pick one weeknight to protect an extra hour of sleep.",
      "you're close - small consistency wins (same wake time daily) will get you the rest of the way.",
      null,
    ],
  },
  {
    id: 2,
    text: "how often do you feel physically exhausted, even after resting?",
    categoryIndex: 0,
    options: [
      { label: "most days", points: 0 },
      { label: "several times a week", points: 1 },
      { label: "occasionally", points: 2 },
      { label: "rarely", points: 3 },
    ],
    tipByOption: [
      "persistent exhaustion after rest is a body signal, not laziness. worth a basic health check (thyroid, iron, sleep quality) if this has been going on for weeks.",
      "frequent fatigue despite rest is worth tracking for two weeks - note sleep, caffeine, and stress spikes together.",
      "occasional exhaustion is normal for founders - just don't let it become the baseline.",
      null,
    ],
  },
  {
    id: 3,
    text: "do you take at least one full day off (no work messages) per week?",
    categoryIndex: 0,
    options: [
      { label: "never", points: 0 },
      { label: "rarely", points: 1 },
      { label: "most weeks", points: 2 },
      { label: "yes, consistently", points: 3 },
    ],
    tipByOption: [
      "zero days off is the single biggest predictor of founder burnout. even 24 hours fully offline recalibrates you more than people expect.",
      "rare days off aren't nothing - try converting one recurring weekend slot into a standing commitment.",
      "you're most of the way there - protect it even during a hard week, that's when it matters most.",
      null,
    ],
  },
  {
    id: 16,
    text: "how often do you rely on caffeine, sugar, or other stimulants just to get through the afternoon?",
    categoryIndex: 0,
    options: [
      { label: "constantly - I couldn't function without them", points: 0 },
      { label: "most days", points: 1 },
      { label: "occasionally", points: 2 },
      { label: "rarely, my energy holds up on its own", points: 3 },
    ],
    tipByOption: [
      "heavy reliance on stimulants to mask exhaustion usually just delays the crash to later in the day, or the week. treating the underlying sleep debt is more effective than adding more caffeine.",
      "leaning on stimulants most days is common but worth noticing - it's a signal your baseline energy is running low, not just an afternoon slump.",
      "occasional reliance during a hard week is normal - just watch that it doesn't become the default.",
      null,
    ],
  },
  {
    id: 17,
    text: "when you wake up on a normal work day, how rested do you generally feel?",
    categoryIndex: 0,
    options: [
      { label: "exhausted before the day even starts", points: 0 },
      { label: "tired, need coffee to function", points: 1 },
      { label: "okay, functional within half an hour", points: 2 },
      { label: "genuinely rested and ready", points: 3 },
    ],
    tipByOption: [
      "waking up already exhausted, day after day, means your sleep isn't doing its basic job of restoring you. worth ruling out both sleep quality issues and simple sleep quantity first.",
      "needing coffee to function is common, but if it's the only thing making you feel human, the underlying sleep debt is worth addressing directly.",
      "functional within half an hour is a reasonable baseline - the goal over time is shortening that runway further.",
      null,
    ],
  },

  // ── Stress & Coping ──────────────────────────────────────────────────────
  {
    id: 4,
    text: "how often do you feel like you're barely keeping up with everything on your plate?",
    categoryIndex: 1,
    options: [
      { label: "constantly", points: 0 },
      { label: "most days", points: 1 },
      { label: "sometimes", points: 2 },
      { label: "rarely", points: 3 },
    ],
    tipByOption: [
      "constant overwhelm usually means too much is undelegated or unprioritised. pick the 3 things only you can do - hand off or drop the rest.",
      "near-daily overwhelm is common in early-stage founders, but it's a signal to revisit what actually needs your attention this week.",
      "occasional overwhelm during crunch periods is normal - the goal is recovery time after, not zero stress.",
      null,
    ],
  },
  {
    id: 5,
    text: "when something goes wrong with the business, how does your body typically react?",
    categoryIndex: 1,
    options: [
      { label: "panic, racing heart, can't think straight", points: 0 },
      { label: "tense up, ruminate for hours", points: 1 },
      { label: "stressed but can refocus within an hour", points: 2 },
      { label: "concerned but stay level-headed", points: 3 },
    ],
    tipByOption: [
      "a full panic response to routine setbacks suggests your nervous system is running on empty. a grounding practice (even 2 minutes of breathing before reacting) can measurably help.",
      "hours of rumination after setbacks drains the energy you need for the actual fix. try writing the problem down and scheduling a specific time to deal with it, rather than carrying it all day.",
      "refocusing within the hour is a healthy pattern - keep whatever your reset habit is.",
      null,
    ],
  },
  {
    id: 6,
    text: "do you have a way to actively decompress (exercise, hobby, meditation, etc.) that you use at least weekly?",
    categoryIndex: 1,
    options: [
      { label: "no, I don't really have one", points: 0 },
      { label: "I know what helps but rarely do it", points: 1 },
      { label: "yes, but inconsistently", points: 2 },
      { label: "yes, and I protect the time for it", points: 3 },
    ],
    tipByOption: [
      "no decompression outlet at all is a risk factor on its own. it doesn't need to be big - 20 minutes of a walk without your phone counts.",
      "knowing what helps but not doing it is the most common founder trap. try scheduling it like a meeting, not an afterthought.",
      "inconsistent is still working - the aim is just to make it harder to skip than to do.",
      null,
    ],
  },
  {
    id: 7,
    text: "in the last month, has stress affected your physical health (headaches, stomach issues, jaw clenching, etc.)?",
    categoryIndex: 1,
    options: [
      { label: "yes, frequently", points: 0 },
      { label: "yes, a few times", points: 1 },
      { label: "rarely", points: 2 },
      { label: "no", points: 3 },
    ],
    tipByOption: [
      "frequent physical stress symptoms are your body escalating a warning it's already given you verbally. worth mentioning to a doctor, not just pushing through.",
      "occasional physical symptoms are common but worth tracking - note what preceded them so you can catch the pattern earlier next time.",
      "rare symptoms suggest your stress is mostly manageable right now - keep an eye on it during high-pressure weeks.",
      null,
    ],
  },
  {
    id: 18,
    text: "when you have a genuinely stressful week, how long does it take you to feel normal again afterward?",
    categoryIndex: 1,
    options: [
      { label: "I don't - the stress just carries into the next week", points: 0 },
      { label: "several days", points: 1 },
      { label: "a day or two", points: 2 },
      { label: "I usually bounce back within hours", points: 3 },
    ],
    tipByOption: [
      "stress that never resolves before the next wave hits is the definition of chronic, cumulative burnout risk. the goal isn't avoiding stressful weeks, it's rebuilding your ability to recover between them.",
      "several days to recover is workable if stressful weeks are occasional, but risky if they're frequent. worth tracking how often you're actually getting a full recovery.",
      "a day or two is a healthy recovery window - protect whatever you're doing that enables it.",
      null,
    ],
  },

  // ── Relationships & Support ───────────────────────────────────────────────
  {
    id: 8,
    text: "do you have at least one person (not a co-founder or employee) you can be fully honest with about how the startup is really going?",
    categoryIndex: 2,
    options: [
      { label: "no", points: 0 },
      { label: "sort of, but I hold back a lot", points: 1 },
      { label: "yes, one person", points: 2 },
      { label: "yes, more than one", points: 3 },
    ],
    tipByOption: [
      "founders without an honest outside sounding board burn out faster and make worse decisions under pressure, because every hard truth stays internal. this is worth actively building, not waiting for.",
      "holding back with the people you do talk to defeats the purpose. pick one relationship and practice being specific about a real struggle, not just a summary.",
      "one honest relationship is a real asset - protect it deliberately, especially when things get busy.",
      null,
    ],
  },
  {
    id: 9,
    text: "how often do you feel isolated in the weight of decision-making?",
    categoryIndex: 2,
    options: [
      { label: "constantly - it feels like it's all on me", points: 0 },
      { label: "often", points: 1 },
      { label: "sometimes", points: 2 },
      { label: "rarely - I share the load", points: 3 },
    ],
    tipByOption: [
      "the loneliness of final-call decisions is one of the most under-discussed parts of founding a company. a founder peer group or mentor relationship - even informal - makes a measurable difference.",
      "frequent isolation in decisions is worth naming to a co-founder, advisor, or peer, even if you still make the final call alone.",
      "some isolation in the top job is normal - the goal is having somewhere to unload it, not eliminating it entirely.",
      null,
    ],
  },
  {
    id: 10,
    text: "have you maintained relationships/friendships outside of the startup world in the last few months?",
    categoryIndex: 2,
    options: [
      { label: "no, work has taken over almost everything", points: 0 },
      { label: "barely - a few messages here and there", points: 1 },
      { label: "somewhat - I make occasional time", points: 2 },
      { label: "yes, I actively protect this", points: 3 },
    ],
    tipByOption: [
      "when work absorbs every relationship, your identity and support system both narrow to one point of failure - the company. rebuilding even one non-startup friendship is worth prioritising.",
      "barely-there relationships tend to quietly disappear. pick one person and put a recurring catch-up on the calendar, not an open-ended 'let's catch up soon.'",
      "occasional time is a reasonable baseline - try turning one of these into a recurring habit.",
      null,
    ],
  },
  {
    id: 19,
    text: "if you had a genuinely bad week, would you actually tell the people close to you, or would you put on a brave face?",
    categoryIndex: 2,
    options: [
      { label: "I'd hide it completely, even from close people", points: 0 },
      { label: "I'd downplay it a lot", points: 1 },
      { label: "I'd share some of it, not the full picture", points: 2 },
      { label: "I'd tell them honestly", points: 3 },
    ],
    tipByOption: [
      "consistently hiding hard weeks, even from people who genuinely care, means your support system exists on paper but isn't actually functioning as support. practice sharing one real, specific struggle with one person this week.",
      "downplaying is common but it trains the people close to you to underestimate how much you're carrying, which makes it harder for them to show up when you actually need it.",
      "sharing some of it is a reasonable middle ground - the goal over time is closing the gap between what you feel and what you say.",
      null,
    ],
  },
  {
    id: 20,
    text: "do you have a co-founder, partner, or close friend who actively checks in on how you're doing (not just the business)?",
    categoryIndex: 2,
    options: [
      { label: "no one checks in like this", points: 0 },
      { label: "rarely, and usually only when things are visibly bad", points: 1 },
      { label: "occasionally", points: 2 },
      { label: "yes, someone does this regularly", points: 3 },
    ],
    tipByOption: [
      "having no one who checks in on you specifically (not the company) means the earliest signs of struggle usually go unnoticed until they're severe. it's worth explicitly asking one person to play this role, rather than waiting for it to happen naturally.",
      "check-ins that only happen once things are visibly bad miss the early window where intervention is easiest. an explicit ask - 'can you check in on me monthly, not just when I seem off' - genuinely helps.",
      "occasional check-ins are a good foundation - making them a standing habit rather than ad hoc makes them more reliable.",
      null,
    ],
  },

  // ── Purpose & Identity ────────────────────────────────────────────────────
  {
    id: 11,
    text: "if the startup failed tomorrow, how much of your sense of self-worth would take a hit?",
    categoryIndex: 3,
    options: [
      { label: "almost all of it - I am the startup right now", points: 0 },
      { label: "a lot", points: 1 },
      { label: "some, but I'd recover", points: 2 },
      { label: "some, but my identity isn't tied to the outcome", points: 3 },
    ],
    tipByOption: [
      "when your entire identity is fused with the company's outcome, every setback becomes an existential threat instead of a business problem. this fusion is a leading cause of founder depression after a shutdown or failed raise.",
      "a strong identity tie to outcomes is common but risky - it's worth naming one part of your identity (a skill, a relationship, a value) that exists independent of company performance.",
      "a recoverable sense of self is a healthy sign - keep nurturing the parts of your identity outside the company.",
      null,
    ],
  },
  {
    id: 12,
    text: "do you still have interests, activities, or people you care about that have nothing to do with the startup?",
    categoryIndex: 3,
    options: [
      { label: "not really anymore", points: 0 },
      { label: "one or two, but I rarely engage with them", points: 1 },
      { label: "yes, a handful", points: 2 },
      { label: "yes, and I actively make time for them", points: 3 },
    ],
    tipByOption: [
      "losing every interest outside the company is one of the clearest early warning signs of founder burnout. pick one thing you used to enjoy and reintroduce it this month, even in a small dose.",
      "having interests you never engage with is a start - try scheduling one of them, even 30 minutes, this week.",
      "a handful of outside interests is a good foundation - the next step is protecting time for them consistently.",
      null,
    ],
  },
  {
    id: 13,
    text: "when you imagine your life 5 years from now, is the startup the only version of the future you can picture?",
    categoryIndex: 3,
    options: [
      { label: "yes, I can't picture anything else", points: 0 },
      { label: "mostly - it's hard to imagine alternatives", points: 1 },
      { label: "I have a rough sense of other paths", points: 2 },
      { label: "yes, I have a clear sense of who I am beyond this company", points: 3 },
    ],
    tipByOption: [
      "when the startup is the only imaginable future, a pivot, shutdown, or acquisition can feel like losing your entire identity, not just a job. it's worth deliberately imagining (and writing down) one alternate path, even if you never take it.",
      "difficulty imagining alternatives is common for founders deep in the grind - a useful exercise is writing one paragraph about what excites you outside this specific company.",
      "having a rough sense of other paths is a healthy buffer against outcome-dependent identity.",
      null,
    ],
  },
  {
    id: 21,
    text: "how often do you introduce yourself, even in your own head, as something other than your job title or company?",
    categoryIndex: 3,
    options: [
      { label: "never - it's always the company first", points: 0 },
      { label: "rarely", points: 1 },
      { label: "sometimes", points: 2 },
      { label: "often - I have a fuller sense of who I am", points: 3 },
    ],
    tipByOption: [
      "if the company is always the first and only thing that comes to mind when you think about who you are, that's identity fusion in its clearest form. try writing a one-sentence description of yourself with no mention of the company at all.",
      "rarely thinking of yourself outside the company role is common but worth actively countering - even small reminders of other parts of your identity help.",
      "sometimes stepping outside the company-first framing is a good sign - the goal is making that the default, not the exception.",
      null,
    ],
  },
  {
    id: 22,
    text: "do you feel like your worth as a person rises and falls with the company's monthly performance?",
    categoryIndex: 3,
    options: [
      { label: "yes, directly - a bad month means I feel like a failure", points: 0 },
      { label: "mostly yes", points: 1 },
      { label: "a little, but I can usually separate the two", points: 2 },
      { label: "no, I've built a clear separation", points: 3 },
    ],
    tipByOption: [
      "tying personal worth directly to monthly company performance means your mental health is at the mercy of factors (market conditions, one investor's mood, timing) that are often outside your control. this link is worth actively challenging, ideally with professional support.",
      "mostly linking self-worth to performance is common among founders but risky over a multi-year journey with inevitable bad months. practicing separating 'the company had a bad month' from 'I am a failure' is a skill, not a fixed trait.",
      "some ability to separate the two already exists - strengthening it further will make the inevitable rough months easier to weather.",
      null,
    ],
  },

  // ── Financial Anxiety ──────────────────────────────────────────────────────
  {
    id: 14,
    text: "how separated do you feel your personal financial stress is from the company's financial stress?",
    categoryIndex: 4,
    options: [
      { label: "not separated at all - company runway = my anxiety", points: 0 },
      { label: "mostly tangled together", points: 1 },
      { label: "somewhat separated", points: 2 },
      { label: "clearly separated - I know my personal number", points: 3 },
    ],
    tipByOption: [
      "when company runway and personal financial anxiety are the same feeling, every fundraising delay hits you twice as hard. write down your actual personal runway number - it's often less scary than the undefined dread.",
      "tangled finances make it hard to think clearly about either the company or yourself. even a rough separate personal budget helps untangle the anxiety.",
      "some separation is a good sign - keep building the habit of checking your personal numbers independently of the company's.",
      null,
    ],
  },
  {
    id: 15,
    text: "do you know, roughly, how many months you personally could go without founder income before real financial trouble?",
    categoryIndex: 4,
    options: [
      { label: "no idea, I try not to think about it", points: 0 },
      { label: "a rough guess, nothing concrete", points: 1 },
      { label: "yes, a fairly accurate number", points: 2 },
      { label: "yes, and I've planned around it", points: 3 },
    ],
    tipByOption: [
      "avoiding the number usually makes the anxiety louder, not quieter. a 20-minute exercise with your actual expenses will likely give you more clarity than weeks of vague worry.",
      "a rough guess is a start - spend 20 minutes turning it into an actual number from your bank statements and expenses.",
      "having an accurate number is genuinely protective for your mental health - it turns abstract dread into a concrete, plannable fact.",
      null,
    ],
  },
  {
    id: 23,
    text: "how often does money anxiety (personal or company) interrupt your sleep or focus during the day?",
    categoryIndex: 4,
    options: [
      { label: "most days - it's a constant background hum", points: 0 },
      { label: "several times a week", points: 1 },
      { label: "occasionally, usually around specific deadlines", points: 2 },
      { label: "rarely", points: 3 },
    ],
    tipByOption: [
      "money anxiety that's constantly intrusive, rather than tied to specific decision points, usually means the underlying numbers haven't been looked at directly in a while. undefined dread is almost always worse than the actual number.",
      "frequent intrusive money anxiety is common under real financial pressure, but worth separating from anxiety that's become a habit independent of the actual numbers.",
      "anxiety concentrated around real deadlines (a payroll date, a renewal) is a reasonable, proportionate response - the goal is keeping it contained to those moments.",
      null,
    ],
  },
  {
    id: 24,
    text: "have you taken a below-market salary or deferred your own pay for an extended period to keep the company running?",
    categoryIndex: 4,
    options: [
      { label: "yes, for a long time, with no real plan to change it", points: 0 },
      { label: "yes, and it's starting to genuinely strain me", points: 1 },
      { label: "yes, but it's a deliberate, time-boxed choice", points: 2 },
      { label: "no, or it was brief and has since normalised", points: 3 },
    ],
    tipByOption: [
      "an open-ended below-market salary with no defined endpoint is one of the clearest drivers of founder financial anxiety, and it compounds the longer it goes unaddressed. worth setting an explicit review date, even if the answer for now stays the same.",
      "noticing the strain is useful information, not something to push past silently. it's worth a direct conversation with your co-founder or board about when this changes.",
      "a deliberate, time-boxed sacrifice is a healthier pattern than an indefinite one - the key is actually revisiting it at the set date.",
      null,
    ],
  },
  {
    id: 25,
    text: "if a friend asked to see your personal bank balance right now, how would you feel about showing them?",
    categoryIndex: 4,
    options: [
      { label: "genuine dread - I actively avoid looking at it myself", points: 0 },
      { label: "uncomfortable, I'd rather not", points: 1 },
      { label: "a little exposed, but okay", points: 2 },
      { label: "fine - I have a realistic, current picture of it", points: 3 },
    ],
    tipByOption: [
      "actively avoiding your own bank balance is a strong sign that the anxiety has outpaced the facts. the number itself, once looked at directly, is almost always more manageable than the dread of not knowing.",
      "discomfort at the thought of showing someone is normal, but avoiding even a private, honest look at your own numbers keeps the anxiety abstract and harder to plan around.",
      "a little exposure but general okay-ness suggests you have a reasonably realistic relationship with your own finances - worth maintaining as things change.",
      null,
    ],
  },

  // ── Work-Life Boundaries ────────────────────────────────────────────────────
  {
    id: 26,
    text: "do you have a defined time each day when you stop checking work messages?",
    categoryIndex: 5,
    options: [
      { label: "no, I'm reachable essentially 24/7", points: 0 },
      { label: "in theory, but I break it most days", points: 1 },
      { label: "yes, most days", points: 2 },
      { label: "yes, consistently, and my team knows it", points: 3 },
    ],
    tipByOption: [
      "being reachable 24/7 with no defined cutoff trains both you and your team to treat every hour as working hours, which is unsustainable over a multi-year company build. picking one hard stop time, even 9pm, is a concrete place to start.",
      "having a theoretical boundary you don't keep is common but doesn't actually protect your recovery time. the fix usually isn't willpower - it's removing the notification, not just intending to ignore it.",
      "keeping the boundary most days is solid - the occasional break is fine as long as it's the exception, not the norm.",
      null,
    ],
  },
  {
    id: 27,
    text: "how often do you work through meals without noticing, or skip them entirely because of work?",
    categoryIndex: 5,
    options: [
      { label: "most days", points: 0 },
      { label: "several times a week", points: 1 },
      { label: "occasionally", points: 2 },
      { label: "rarely - I keep regular meal times", points: 3 },
    ],
    tipByOption: [
      "regularly skipping or working through meals is a small habit that compounds into real physical and cognitive costs over months. protecting even 15 minutes for an actual meal break, away from the screen, is worth treating as non-negotiable.",
      "skipping meals several times a week under real pressure is common, but worth noticing as a pattern rather than a one-off.",
      "occasional skipped meals during genuine crunch periods are fine - the goal is making sure it's the exception.",
      null,
    ],
  },
  {
    id: 28,
    text: "when you're not physically working, how often is your mind still fully on the company?",
    categoryIndex: 5,
    options: [
      { label: "almost always - I can't switch off", points: 0 },
      { label: "most of the time", points: 1 },
      { label: "sometimes, but I can redirect it", points: 2 },
      { label: "rarely - I can genuinely be present elsewhere", points: 3 },
    ],
    tipByOption: [
      "an inability to mentally switch off, even during nominal downtime, means you're never actually getting the recovery that time off is supposed to provide. a specific 'worry window' - 15 minutes to write down company thoughts before bed - can help contain this.",
      "the mind staying on the company most of the time is extremely common for founders, but it's worth actively practicing redirecting it, rather than assuming it's unchangeable.",
      "being able to redirect your attention sometimes is a good sign - it means the skill exists, even if it's not yet consistent.",
      null,
    ],
  },
  {
    id: 29,
    text: "do you take real vacation time (multiple consecutive days, genuinely offline) at least once or twice a year?",
    categoryIndex: 5,
    options: [
      { label: "I haven't taken real time off in over a year", points: 0 },
      { label: "I've taken days off, but rarely fully offline", points: 1 },
      { label: "yes, once a year or so", points: 2 },
      { label: "yes, multiple times a year, genuinely offline", points: 3 },
    ],
    tipByOption: [
      "going over a year without any real time off is a significant burnout risk factor on its own, independent of how the rest of your habits look. even a short, genuinely offline long weekend is worth prioritising sooner rather than later.",
      "taking days off that aren't actually offline defeats much of the recovery purpose - the mental disconnection matters as much as the physical location.",
      "once a year is a reasonable baseline - protecting it even during a hard year for the business is worth the discipline.",
      null,
    ],
  },
  {
    id: 30,
    text: "does your team or co-founder ever have to remind you to stop working or go home?",
    categoryIndex: 5,
    options: [
      { label: "yes, regularly, and I usually ignore it", points: 0 },
      { label: "occasionally, and I sometimes listen", points: 1 },
      { label: "rarely, I mostly manage my own limits", points: 2 },
      { label: "no, I don't need reminding", points: 3 },
    ],
    tipByOption: [
      "if people around you are regularly flagging that you should stop, and you're regularly overriding that, it's worth treating their observation as more objective than your own in-the-moment judgment.",
      "occasionally listening when reminded is a start - the goal is building the internal version of that reminder so it doesn't have to come from someone else every time.",
      "mostly managing your own limits well is a good sign - keep the people who do occasionally flag it as a useful check.",
      null,
    ],
  },

  // ── Physical Health ──────────────────────────────────────────────────────
  {
    id: 31,
    text: "how often do you get any form of physical movement or exercise in a typical week?",
    categoryIndex: 6,
    options: [
      { label: "essentially never", points: 0 },
      { label: "once or so, inconsistently", points: 1 },
      { label: "2-3 times a week", points: 2 },
      { label: "regularly, most days", points: 3 },
    ],
    tipByOption: [
      "essentially no physical movement compounds both physical and mental health risk over time, especially combined with long sedentary work hours. even a 15-minute daily walk measurably helps mood and sleep, and doesn't require a gym membership or major time commitment.",
      "inconsistent movement is a start - anchoring it to something else you already do daily (right after a specific meal, right before a specific meeting) tends to make it stick better than relying on motivation.",
      "2-3 times a week is a solid baseline - the main risk is losing it during high-pressure stretches, which is exactly when it matters most.",
      null,
    ],
  },
  {
    id: 32,
    text: "when did you last have a general health check-up (not related to a specific complaint)?",
    categoryIndex: 6,
    options: [
      { label: "I honestly can't remember", points: 0 },
      { label: "more than 2 years ago", points: 1 },
      { label: "within the last year or two", points: 2 },
      { label: "within the last year, and I go regularly", points: 3 },
    ],
    tipByOption: [
      "founders often defer basic health check-ups the same way they defer personal time off - treating their own maintenance as less urgent than the company's. many stress-related physical symptoms are easily caught early and are harder to reverse once ignored for years.",
      "over two years is a long gap - even a basic annual check-up (blood pressure, basic bloodwork) is a low-effort, high-value thing to schedule this month.",
      "within the last year or two is a reasonable baseline - the next step is making it a standing yearly habit rather than an occasional one.",
      null,
    ],
  },
  {
    id: 33,
    text: "how would you describe your eating patterns during a high-stress work period?",
    categoryIndex: 6,
    options: [
      { label: "erratic - skipped meals, then overeating, mostly convenience food", points: 0 },
      { label: "worse than normal but still functional", points: 1 },
      { label: "mostly stable, with some slippage", points: 2 },
      { label: "I keep it fairly consistent even under pressure", points: 3 },
    ],
    tipByOption: [
      "erratic eating under stress (skipping meals then overeating processed food) tends to worsen the exact symptoms - fatigue, irritability, poor focus - that make a stressful period harder to manage in the first place. even keeping one meal a day consistent and real can meaningfully help.",
      "some decline under stress is normal, but worth having one anchor meal you protect regardless of how the day is going.",
      "mostly stable with occasional slippage is a healthy pattern - the goal is just noticing when the slippage becomes the norm rather than the exception.",
      null,
    ],
  },
  {
    id: 34,
    text: "have you noticed any new or worsening physical symptoms in the last few months that you've been putting off addressing?",
    categoryIndex: 6,
    options: [
      { label: "yes, several, and I've been ignoring them", points: 0 },
      { label: "yes, one or two, and I keep meaning to deal with it", points: 1 },
      { label: "one minor thing, nothing serious", points: 2 },
      { label: "no, nothing I'm aware of and putting off", points: 3 },
    ],
    tipByOption: [
      "ignoring multiple new or worsening symptoms, especially while under sustained stress, risks letting something manageable become something serious. booking the appointment you've been deferring is worth doing this week, not when things calm down.",
      "'meaning to deal with it' for an extended period is a common founder pattern - the deferral itself often causes more anxiety than the appointment would.",
      "one minor, monitored thing is a normal and low-risk state - just keep tracking it.",
      null,
    ],
  },
  {
    id: 35,
    text: "how much water, and how little alcohol/other substances, do you typically consume in a stressful week versus a normal one?",
    categoryIndex: 6,
    options: [
      { label: "I drink far less water and lean much more heavily on alcohol or other substances", points: 0 },
      { label: "somewhat worse on both fronts", points: 1 },
      { label: "roughly the same", points: 2 },
      { label: "I actively protect both during stressful periods", points: 3 },
    ],
    tipByOption: [
      "using alcohol or other substances noticeably more heavily specifically during stressful periods is worth taking seriously as a coping pattern, not just a preference - it's one of the more reliable early indicators that stress is being managed unsustainably. this is genuinely worth raising with a doctor or therapist directly.",
      "some slippage on both fronts during hard weeks is common, but tracking whether it's becoming a pattern rather than an occasional response is useful.",
      "staying roughly consistent under stress is a good sign for your baseline coping mechanisms.",
      null,
    ],
  },

  // ── Emotional Regulation ────────────────────────────────────────────────────
  {
    id: 36,
    text: "how often do you snap at, or feel disproportionately irritated with, people who don't deserve it (team, family, friends)?",
    categoryIndex: 7,
    options: [
      { label: "regularly - I notice it happening and can't seem to stop it in the moment", points: 0 },
      { label: "sometimes, and I usually feel bad about it after", points: 1 },
      { label: "occasionally, during genuinely hard weeks", points: 2 },
      { label: "rarely - my reactions generally match the situation", points: 3 },
    ],
    tipByOption: [
      "regularly reacting disproportionately, especially toward people who aren't the actual source of the stress, is a classic and under-discussed burnout symptom - your baseline emotional reserve is running low. this is worth naming directly to the people affected, and addressing with more than willpower alone.",
      "occasional disproportionate reactions followed by regret is common and manageable - the useful next step is noticing the pattern earlier, before the reaction happens, not just after.",
      "reactions largely matching the actual situation, even during hard weeks, is a healthy sign of emotional regulation holding up under pressure.",
      null,
    ],
  },
  {
    id: 37,
    text: "how often do you feel emotionally numb or disconnected, even during moments that should feel good (a win, good news, time with people you care about)?",
    categoryIndex: 7,
    options: [
      { label: "most of the time - good news barely registers anymore", points: 0 },
      { label: "often", points: 1 },
      { label: "occasionally", points: 2 },
      { label: "rarely - I can still feel genuine highs and lows", points: 3 },
    ],
    tipByOption: [
      "persistent emotional numbness, especially a flattened response to genuinely good news, is one of the clearer signs of burnout moving toward something more serious, and is worth discussing directly with a professional rather than waiting for it to resolve on its own.",
      "frequent emotional flatness is worth tracking - note whether it's tied to specific stress spikes or has become a more constant baseline.",
      "occasional numbness during exhausting periods is common - the concern is mainly if it becomes the default state rather than a temporary dip.",
      null,
    ],
  },
  {
    id: 38,
    text: "when you feel a strong negative emotion (anger, panic, despair) about the business, what do you typically do with it?",
    categoryIndex: 7,
    options: [
      { label: "act on it immediately - send the message, make the call, while still in it", points: 0 },
      { label: "suppress it and push through, dealing with it later if at all", points: 1 },
      { label: "usually wait until I've calmed down before responding", points: 2 },
      { label: "I have a specific practice (writing it down, talking it through) before acting", points: 3 },
    ],
    tipByOption: [
      "acting on strong emotion in the moment, particularly with the business (a heated message, an impulsive decision), tends to create problems that outlast the emotion itself. building in even a 10-minute pause before responding to anything emotionally charged is a high-leverage habit.",
      "suppressing rather than processing means the emotion doesn't actually go away - it tends to surface later, often at a worse time or in a worse form (physical symptoms, irritability elsewhere).",
      "waiting until calmer before responding is a solid instinct - formalising it into an explicit pause (even writing a draft and not sending it) makes it more reliable under real pressure.",
      null,
    ],
  },
  {
    id: 39,
    text: "how often do minor setbacks (a slow week, one lost deal, a critical comment) spiral into feeling like everything is falling apart?",
    categoryIndex: 7,
    options: [
      { label: "almost every time - small things regularly feel catastrophic", points: 0 },
      { label: "often", points: 1 },
      { label: "occasionally, usually when I'm already depleted", points: 2 },
      { label: "rarely - I can generally keep proportion", points: 3 },
    ],
    tipByOption: [
      "minor setbacks consistently spiraling into a sense of total catastrophe is a strong sign your baseline emotional reserve is depleted - the setback itself isn't usually the real problem, the depletion is. this pattern often responds well to both rest and professional support together.",
      "frequent spiraling is worth naming explicitly when it happens ('this feels bigger than it actually is right now') as a way to interrupt the pattern in real time.",
      "occasional spiraling specifically when already depleted is a useful, honest signal - it's telling you the setback isn't the real issue, your capacity is.",
      null,
    ],
  },
  {
    id: 40,
    text: "do you have any practice (breathing, journaling, therapy, meditation, talking it out) for processing difficult emotions, rather than just pushing past them?",
    categoryIndex: 7,
    options: [
      { label: "no, I just push through until it passes or doesn't", points: 0 },
      { label: "I've tried something before but don't do it anymore", points: 1 },
      { label: "yes, but inconsistently", points: 2 },
      { label: "yes, and I use it regularly", points: 3 },
    ],
    tipByOption: [
      "having no processing practice at all means every difficult emotion just accumulates rather than resolving, which tends to surface eventually as either a bigger emotional event or a physical symptom. starting with something small and low-effort (even 5 minutes of writing) is a reasonable first step.",
      "having tried something before and stopped is common - worth revisiting what specifically made it lapse (time, forgetting, not feeling like it helped) rather than assuming the practice itself didn't work.",
      "inconsistent use is still meaningfully better than none - the aim is making it a default response to stress rather than an occasional one.",
      null,
    ],
  },

  // ── Leadership & Team Pressure ────────────────────────────────────────────────
  {
    id: 41,
    text: "do you feel you have to project confidence and certainty to your team even when you genuinely don't feel it?",
    categoryIndex: 8,
    options: [
      { label: "constantly - I never show real uncertainty to the team", points: 0 },
      { label: "most of the time", points: 1 },
      { label: "sometimes, but I can be appropriately honest occasionally", points: 2 },
      { label: "rarely - I can be honestly uncertain with my team when it's true", points: 3 },
    ],
    tipByOption: [
      "constantly performing certainty you don't feel is exhausting in a way that compounds over years, and it also deprives your team of the chance to see (and learn from) how a leader handles genuine uncertainty. some appropriately calibrated honesty about not having all the answers is usually more trust-building, not less.",
      "mostly performing confidence is common in early leadership roles, but worth actively practicing small moments of appropriate honesty rather than treating it as an all-or-nothing switch.",
      "being able to be honest about uncertainty sometimes is a good foundation - the goal is expanding when that feels safe to do, not forcing it in every situation.",
      null,
    ],
  },
  {
    id: 42,
    text: "how often do you feel responsible for your team's morale or happiness, beyond what's reasonable for your actual role?",
    categoryIndex: 8,
    options: [
      { label: "constantly - their mood feels like my job to manage", points: 0 },
      { label: "often", points: 1 },
      { label: "sometimes, in specific high-stakes moments", points: 2 },
      { label: "rarely - I care, but don't carry it as my sole responsibility", points: 3 },
    ],
    tipByOption: [
      "feeling personally responsible for every team member's mood is an unsustainable weight to carry alone, and it usually isn't accurate - people's wellbeing is influenced by many factors outside your control. it's worth distinguishing 'I want my team to be okay' from 'their okay-ness is entirely on me.'",
      "carrying this often is common for empathetic founders, but worth actively examining which parts are genuinely yours to manage (workload, clarity, respect) versus which aren't (someone's personal life, their individual resilience).",
      "feeling this in specific high-stakes moments (a layoff, a hard pivot) is a proportionate response - the concern is mainly if it becomes the default state.",
      null,
    ],
  },
  {
    id: 43,
    text: "have you had to make a difficult people decision (a layoff, a firing, a hard restructuring) in the last year, and how has it affected you?",
    categoryIndex: 8,
    options: [
      { label: "yes, and it's still weighing on me heavily", points: 0 },
      { label: "yes, and it affected me more than I expected, still processing", points: 1 },
      { label: "yes, it was hard but I've largely processed it", points: 2 },
      { label: "no, or yes and I handled it with support in place", points: 3 },
    ],
    tipByOption: [
      "difficult people decisions carry a real, often underestimated emotional weight for the person making them, not just for the people affected - and that weight doesn't automatically resolve on its own. talking it through with someone outside the situation (a peer founder, therapist, mentor) is worth doing directly, rather than assuming it'll fade with time.",
      "still processing more than expected months later is a normal response to a genuinely hard decision, not a sign you handled it badly. giving yourself explicit space to process it, rather than moving straight to the next fire, tends to help.",
      "having largely processed a hard decision is a good sign of resilience - it's still worth checking in on periodically, since these things can resurface.",
      null,
    ],
  },
  {
    id: 44,
    text: "do you feel you can be vulnerable or ask for help from your board, investors, or advisors when things are genuinely hard?",
    categoryIndex: 8,
    options: [
      { label: "no, I feel I always have to appear in control with them", points: 0 },
      { label: "rarely, and only in a carefully managed way", points: 1 },
      { label: "with some of them, selectively", points: 2 },
      { label: "yes, with at least one person in that circle", points: 3 },
    ],
    tipByOption: [
      "feeling unable to show any vulnerability to your board or investors adds a specific, ongoing performance burden on top of the company's actual challenges. finding even one advisor or board member you can be genuinely honest with tends to reduce this burden significantly, and often improves the actual advice you get too.",
      "carefully managed vulnerability is common, but worth noting it as a real cost - the performance itself takes energy that could go elsewhere.",
      "having selective honesty with some of them is a reasonable, realistic middle ground given the genuine power dynamics involved.",
      null,
    ],
  },
  {
    id: 45,
    text: "how often do you feel like you're the only thing standing between the company functioning and falling apart?",
    categoryIndex: 8,
    options: [
      { label: "constantly - nothing works if I'm not directly involved", points: 0 },
      { label: "often", points: 1 },
      { label: "sometimes, in specific critical areas", points: 2 },
      { label: "rarely - the team can function without me in most areas", points: 3 },
    ],
    tipByOption: [
      "feeling constantly indispensable, across the board, is usually both exhausting and a sign that delegation and documentation haven't kept pace with the company's growth - not a permanent fact about how the company has to run. picking one area to deliberately hand off this quarter is a concrete starting point.",
      "feeling this often, especially in a growing team, is common but worth actively addressing through delegation rather than treating as simply the nature of founding.",
      "feeling essential in specific critical areas (final product calls, key relationships) is reasonable and expected - the concern is mainly if that list keeps growing rather than shrinking as the team matures.",
      null,
    ],
  },

  // ── Hope & Future Outlook ────────────────────────────────────────────────────
  {
    id: 46,
    text: "when you think about the next 6-12 months of building this company, what's your predominant feeling?",
    categoryIndex: 9,
    options: [
      { label: "dread - I mostly feel like I'm just trying to survive it", points: 0 },
      { label: "anxious more than excited", points: 1 },
      { label: "a mix of nerves and genuine interest", points: 2 },
      { label: "mostly genuine excitement about what's ahead", points: 3 },
    ],
    tipByOption: [
      "predominant dread about the near future, rather than the ordinary nervousness of building something hard, is a meaningful signal worth taking seriously rather than pushing past. it's worth exploring, ideally with a professional, whether this is about the company specifically or a broader sign of burnout.",
      "more anxiety than excitement is common during genuinely difficult stretches, but worth tracking whether it's tied to a specific rough patch or has become the default outlook.",
      "a mix of nerves and genuine interest is a healthy, normal state for building something uncertain - it suggests the hard parts haven't crowded out the parts that motivated you in the first place.",
      null,
    ],
  },
  {
    id: 47,
    text: "do you still feel like there's a version of this company's future that excites you, separate from just avoiding failure?",
    categoryIndex: 9,
    options: [
      { label: "no, it's entirely about not failing at this point", points: 0 },
      { label: "barely - the excitement feels like a distant memory", points: 1 },
      { label: "yes, though it's harder to access than it used to be", points: 2 },
      { label: "yes, clearly, and it still motivates me", points: 3 },
    ],
    tipByOption: [
      "when the entire orientation toward the company has shifted from 'building toward something exciting' to 'avoiding failure,' that's a significant shift worth naming directly, since it usually means burnout or misalignment, not just a hard patch. this is worth exploring, sometimes with a coach or therapist, rather than treating it as a normal phase to just push through.",
      "the excitement feeling like a distant memory is worth taking seriously - try writing down, specifically, what excited you about this when you started, and honestly assessing whether that's still true or whether the goal itself has changed.",
      "excitement that's harder to access but still present is a normal effect of sustained hard work - worth deliberately revisiting what originally motivated you periodically, rather than assuming it'll surface on its own.",
      null,
    ],
  },
  {
    id: 48,
    text: "how often do you have a genuine, non-work-related thing to look forward to in the next few weeks?",
    categoryIndex: 9,
    options: [
      { label: "essentially never - my calendar is entirely work", points: 0 },
      { label: "rarely", points: 1 },
      { label: "occasionally", points: 2 },
      { label: "regularly - there's usually something I'm looking forward to", points: 3 },
    ],
    tipByOption: [
      "having nothing non-work to look forward to, consistently, tends to make the day-to-day grind feel endless rather than purposeful, which itself worsens mood and motivation. deliberately scheduling one small non-work thing in the next two weeks, even something modest, is a concrete first step.",
      "rarely having something to look forward to is worth changing directly - it doesn't need to be large, a dinner with a friend or a small trip counts.",
      "occasionally having something to anticipate is a reasonable baseline - the goal is making it more consistent, not necessarily bigger.",
      null,
    ],
  },
  {
    id: 49,
    text: "if you imagine yourself doing this exact role for another 3 years, how do you feel?",
    categoryIndex: 9,
    options: [
      { label: "genuinely can't picture it, or the thought is exhausting", points: 0 },
      { label: "uneasy about it", points: 1 },
      { label: "neutral - unsure but not distressed", points: 2 },
      { label: "genuinely fine, even motivated by the thought", points: 3 },
    ],
    tipByOption: [
      "if imagining another 3 years in this exact role feels exhausting or impossible, that's worth taking seriously as data, not dismissing as normal founder fatigue. it may point toward burnout that rest can fix, or toward a genuine misalignment worth exploring honestly, ideally with outside support.",
      "unease about the long-term picture is worth naming specifically - is it the role, the current stage of the company, or something else that's the actual source?",
      "neutral, unsure-but-not-distressed is a reasonable place to sit while things are genuinely uncertain - it's worth revisiting periodically rather than treating as a fixed answer.",
      null,
    ],
  },
  {
    id: 50,
    text: "overall, if someone who knew you well five years ago saw you today, do you think they'd say you seem well?",
    categoryIndex: 9,
    options: [
      { label: "no, I think they'd be concerned", points: 0 },
      { label: "they'd probably notice I've changed, and not entirely for the better", points: 1 },
      { label: "mostly yes, with some visible wear", points: 2 },
      { label: "yes, I think they'd say I seem genuinely well", points: 3 },
    ],
    tipByOption: [
      "suspecting that someone who knows you well would be concerned is a meaningful, honest signal worth acting on rather than reasoning away. consider actually asking that person directly what they've noticed - an outside view is often clearer than your own.",
      "noticing you've changed and not entirely for the better is common after years of high-pressure building, but worth exploring specifically what's changed and whether it's a cost you're consciously willing to keep paying.",
      "mostly well with some visible wear is a realistic, honest place for most founders deep in a hard build - the goal is making sure the wear doesn't quietly keep accumulating unaddressed.",
      null,
    ],
  },
]

export function computeWellbeingCategoryScores(answers: Answers): Record<number, { earned: number; max: number }> {
  return Object.fromEntries(
    WELLBEING_CATEGORIES.map((cat) => {
      const earned = cat.questionIds.reduce((sum, qId) => {
        const optIdx = answers[qId]
        if (optIdx === undefined) return sum
        const q = WELLBEING_QUESTIONS.find((q) => q.id === qId)!
        return sum + q.options[optIdx].points
      }, 0)
      return [cat.index, { earned, max: cat.maxPoints }]
    })
  )
}

export function computeWellbeingTotal(answers: Answers): number {
  const maxTotal = WELLBEING_CATEGORIES.reduce((sum, c) => sum + c.maxPoints, 0)
  const earned = WELLBEING_QUESTIONS.reduce((sum, q) => {
    const optIdx = answers[q.id]
    return optIdx !== undefined ? sum + q.options[optIdx].points : sum
  }, 0)
  return Math.round((earned / maxTotal) * 100)
}

export function getWellbeingTopTips(answers: Answers, max = 3): string[] {
  return WELLBEING_QUESTIONS.flatMap((q) => {
    const optIdx = answers[q.id]
    if (optIdx === undefined) return []
    const tip = q.tipByOption[optIdx]
    if (!tip) return []
    const gap = q.options[3].points - q.options[optIdx].points
    return [{ tip, gap }]
  })
    .sort((a, b) => b.gap - a.gap)
    .slice(0, max)
    .map((x) => x.tip)
}

export function getWellbeingBand(score: number): { label: string; color: string; directional: string } {
  if (score >= 80) return {
    label: "thriving",
    color: "text-green-700",
    directional: "your fundamentals are in good shape. keep protecting the habits that got you here - they matter more, not less, as the company grows.",
  }
  if (score >= 60) return {
    label: "managing",
    color: "text-blue-700",
    directional: "you're holding it together, but a few areas are quietly draining you. small, consistent changes now are cheaper than a full burnout later.",
  }
  if (score >= 40) return {
    label: "at risk",
    color: "text-amber-700",
    directional: "several areas need real attention. this isn't about doing more - it's about protecting a few non-negotiables before the gaps compound.",
  }
  return {
    label: "burning out",
    color: "text-orange-700",
    directional: "multiple signals point to burnout risk right now. this is worth treating seriously - talk to someone (a friend, doctor, or therapist), not just this scorecard.",
  }
}
