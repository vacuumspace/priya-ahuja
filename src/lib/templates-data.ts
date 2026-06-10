export type TemplateSection = {
  heading: string
  body: string // markdown-like rich text, rendered as HTML
}

export type Template = {
  slug: string
  title: string
  description: string
  price: number // in paise
  tag: string
  category: "fundraise" | "startup"
  comingSoon: boolean
  preview: string // 1–2 lines shown before purchase
  sections: TemplateSection[] // full content, shown after purchase
}

export const templates: Template[] = [
  // ─── FUNDRAISE ───────────────────────────────────────────────────────────────
  {
    slug: "investor-outreach-templates",
    title: "Investor Outreach Templates",
    description:
      "Cold email templates, follow-up sequences, and LinkedIn messages that have actually gotten replies from Indian VCs.",
    price: 49900,
    tag: "templates",
    category: "fundraise",
    comingSoon: false,
    preview:
      "7 battle-tested cold emails, 3 follow-up sequences, and 4 LinkedIn connection messages — each with notes on why they work.",
    sections: [
      {
        heading: "Cold Email #1 — The Warm Intro Ask",
        body: `**Subject:** Quick intro request — [Mutual contact] suggested I reach out

Hi [Investor first name],

[Mutual contact] mentioned you've backed a few companies in [space] and thought there might be a fit with what we're building.

I'm [Name], co-founder of [Company]. We [one-line what you do] — we've gone from 0 to [metric] in [timeframe] with no outside capital.

Would you be open to a 20-minute call this week or next?

[Your name]

---
**Why it works:** The mutual contact creates instant trust. The metric does the heavy lifting — no pitch, no ask for money, just proof of traction. Keeping it under 80 words forces you to only include what matters.`,
      },
      {
        heading: "Cold Email #2 — The Traction Lede",
        body: `**Subject:** [Company] — ₹[X]L MRR, raising seed

Hi [Investor first name],

We crossed ₹[X]L MRR last month. We're raising a ₹[X]Cr seed round and keeping the round tight — 3–4 investors max.

[Company] is [one-line description]. Our customers are [who], paying [ARPU], with [retention stat].

I've been following your investments in [portfolio company] and [portfolio company] — I think there's a clear thesis match.

Happy to send the deck or hop on a call.

[Your name]

---
**Why it works:** Traction in the subject line filters for investors who care about the stage you're at. Leading with revenue signals you don't need permission to exist. The small round size creates scarcity.`,
      },
      {
        heading: "Cold Email #3 — The Insight Email",
        body: `**Subject:** Something I noticed about [their portfolio company's space]

Hi [Investor first name],

I've been watching [portfolio company] and [competitor] for the last year — there's a pattern in how [specific insight about the market].

We're building [Company] because of exactly this. [2 sentences on what you do differently].

We just closed [X customers / ₹XL ARR / X% month-on-month growth]. Raising a ₹[X]Cr seed — would love 20 minutes.

[Your name]

---
**Why it works:** This positions you as a peer, not a supplicant. Investors who've backed a company in your space want to know what's changed. The insight demonstrates you're thinking at a strategic level, not just selling.`,
      },
      {
        heading: "Cold Email #4 — The Direct Ask",
        body: `**Subject:** Seed round — [Company], [space]

[Investor first name],

[Company] — [one-liner].

Numbers:
- ₹[X]L MRR / [X] paying customers
- [X]% MoM growth, [X] months straight
- CAC ₹[X], LTV ₹[X]

Raising ₹[X]Cr. [X]% allocated. Looking for [X] more investors.

Deck: [link]

Worth a call?

[Your name]

---
**Why it works:** Some investors prefer pure signal. No story, no flattery — just numbers. Use this for investors who've explicitly said they want concise outreach, or for second-tier targets where you don't have a warm intro.`,
      },
      {
        heading: "Cold Email #5 — The Portfolio Angle",
        body: `**Subject:** Saw your investment in [portfolio co] — building the next layer

Hi [Investor first name],

Your bet on [portfolio company] was early and right. We're building [Company] — [one-line] — which sits directly on top of / complements / is the enterprise version of what they built.

[Portfolio company] solved [X problem]. We're solving [Y problem] for [Z customer segment], which [portfolio company] deliberately left on the table.

We're at ₹[X]L ARR and raising ₹[X]Cr. Happy to share the deck.

[Your name]

---
**Why it works:** References something the investor already believes in. Framing yourself as additive (not competitive) to a portfolio company is smart — it signals you've done your homework and there's no portfolio conflict.`,
      },
      {
        heading: "Cold Email #6 — Post-Event Reconnect",
        body: `**Subject:** Good meeting you at [event]

Hi [Investor first name],

Enjoyed our 5 minutes at [event] — you mentioned [specific thing they said].

To follow up properly: [Company] is [one-liner]. We've hit [key traction metric] and are raising ₹[X]Cr.

Here's the deck: [link]. Would you be open to a proper conversation?

[Your name]

---
**Why it works:** References a real human moment. Most founders send generic follow-ups — this one proves you were actually listening. The deck link respects their time.`,
      },
      {
        heading: "Cold Email #7 — The Re-Engage",
        body: `**Subject:** [Company] — update since we last spoke

Hi [Investor first name],

We spoke [X months ago] — you passed because [thing you remember they said, e.g. "the market felt early"].

Since then:
- [Milestone 1]
- [Milestone 2]
- [Milestone 3]

The market has moved. I'd love to revisit if you have 20 minutes.

[Your name]

---
**Why it works:** Investors who passed once are warm leads. They already know your story. Showing you remembered why they passed — and that you've addressed it — is one of the highest-conversion outreach moves. Keep the update list tight: 3 bullets max.`,
      },
      {
        heading: "Follow-Up Sequence #1 — Standard 3-Email Sequence",
        body: `**Email 1 (Day 0):** Your cold email (use any of the 7 above).

**Email 2 (Day 5):**
Subject: Re: [original subject]

Hi [name], bumping this up in case it got buried.

Happy to send a 2-pager if a full deck feels like too much right now.

[Your name]

---
**Email 3 (Day 12):**
Subject: Re: [original subject]

Last nudge — I know inboxes are brutal.

If the timing isn't right or it's not a fit, totally fine. Just let me know and I'll stop following up.

[Your name]

---
**Why it works:** Three emails is the maximum before you damage the relationship. The second email offers a lower-commitment option (2-pager). The third email gives them an easy out — which paradoxically gets more replies than a hard push.`,
      },
      {
        heading: "Follow-Up Sequence #2 — The Value Add",
        body: `**Email 1 (Day 0):** Your cold email.

**Email 2 (Day 6):**
Subject: Something you might find useful — Re: [Company]

Hi [name],

Following up, and also wanted to share something: [link to article / data point / insight that's genuinely relevant to their portfolio or thesis].

Thought of you when I read this because [specific reason].

Still happy to connect on [Company] when the timing works.

[Your name]

---
**Why it works:** Adds value before the ask. Positions you as someone worth knowing, not just another founder in the queue. Only works if the content you share is actually good and relevant — don't be generic.`,
      },
      {
        heading: "Follow-Up Sequence #3 — The Traction Update",
        body: `**Email 1 (Day 0):** Your cold email.

**Email 2 (Day 7):**
Subject: Quick update — Re: [Company]

Hi [name],

Following up from last week. Also worth sharing: we just [new milestone — customer win, revenue jump, press, etc.].

Momentum is building. Still raising, still have room in the round.

Worth 20 minutes?

[Your name]

---
**Why it works:** Traction updates as follow-ups are the highest-converting follow-up type. It's not "did you see my email" — it's "things are moving, here's proof." If you can share a real update every 5–7 days, do it.`,
      },
      {
        heading: "LinkedIn Messages",
        body: `**Connection Request Note (300 char max):**
Hi [name] — I'm building [Company], [one-liner]. I've been following your work on [portfolio company / theme]. Would love to connect.

---
**First Message After Connection:**
Thanks for connecting, [name].

[Company] — [one-liner]. We're at [key metric] and raising ₹[X]Cr.

I know your time is valuable — happy to share a 1-pager or short deck if it makes sense to take a look.

---
**Message if They View Your Profile But Don't Respond to Email:**
Hi [name] — noticed you looked at my profile. I reached out via email last week about [Company]. Happy to send a deck or connect briefly if you'd like.

---
**Why these work:** LinkedIn messages should be shorter than email. Under 100 words always. The profile-view message is very high-converting because it references a signal they gave you.`,
      },
    ],
  },
  {
    slug: "fundraising-checklist",
    title: "Pre-Fundraise Readiness Checklist",
    description:
      "A 40-point checklist covering everything from financial model hygiene to cap table structure, before you talk to a single investor.",
    price: 29900,
    tag: "checklist",
    category: "fundraise",
    comingSoon: false,
    preview:
      "40 items across 6 categories: narrative, financials, legal, product, team, and data room. Each item has a pass/fail criterion.",
    sections: [
      {
        heading: "Section 1: Narrative Readiness (8 points)",
        body: `**1. One-liner**
Can you explain what your company does in one sentence, without jargon, to someone who's never heard of you?
✅ Pass: Your non-founder friends understand it immediately.
❌ Fail: You need more than one sentence, or you default to "it's like X but for Y."

**2. Problem Statement**
Can you articulate the problem without referencing your solution?
✅ Pass: The problem makes someone feel the pain independently.
❌ Fail: Your problem statement only makes sense if the solution exists.

**3. Why Now**
Do you have a specific answer to why this company couldn't have been built 3 years ago?
✅ Pass: Regulatory change, infrastructure shift, or behaviour change happened — you can name it.
❌ Fail: Your answer is "the market is big and growing."

**4. Why You**
Do you have an unfair advantage — domain expertise, distribution, proprietary data, or network — that you can articulate clearly?
✅ Pass: Your answer isn't just "we're passionate."
❌ Fail: Any team could build what you're building.

**5. Market Size**
Have you built a bottoms-up TAM/SAM/SOM, not just quoted a Statista report?
✅ Pass: You can walk through the calculation.
❌ Fail: You lead with "the market is a $50B opportunity."

**6. Business Model**
Can you explain how you make money, who pays, and what the unit economics look like?
✅ Pass: You know your LTV:CAC ratio and payback period.
❌ Fail: "We'll figure out monetisation later."

**7. Competition**
Do you have a clear view of the competitive landscape — not just direct competitors but substitute behaviours?
✅ Pass: You know why customers choose you over doing nothing.
❌ Fail: Your answer is "there's no real competition."

**8. 18-Month Roadmap**
Can you articulate clearly what you'll do with the money you're raising, milestone by milestone?
✅ Pass: Each milestone is specific and falsifiable.
❌ Fail: "Product + team + marketing" without specifics.`,
      },
      {
        heading: "Section 2: Financial Readiness (8 points)",
        body: `**9. Revenue Tracking**
Do you have a single source of truth for MRR/ARR that you can pull up in 30 seconds?
✅ Pass: Dashboard or spreadsheet, updated weekly.
❌ Fail: You have to calculate it fresh each time.

**10. Burn Rate**
Do you know your exact monthly burn and runway to the day?
✅ Pass: You know this without opening a spreadsheet.
❌ Fail: "Around ₹X lakhs" — vague is a red flag.

**11. Unit Economics**
Do you know your CAC, LTV, payback period, and gross margin?
✅ Pass: You have these per cohort, not just blended.
❌ Fail: You've never calculated LTV.

**12. Financial Model**
Do you have a 3-year model with realistic assumptions?
✅ Pass: Assumptions are documented; model is scenario-based (base/bear/bull).
❌ Fail: Your model shows hockey-stick growth with no drivers explained.

**13. Revenue Quality**
Do you distinguish between recurring and one-time revenue?
✅ Pass: MRR vs. non-recurring clearly separated.
❌ Fail: You're counting one-time services in MRR.

**14. Churn**
Do you track gross and net revenue retention?
✅ Pass: You know monthly churn by cohort.
❌ Fail: "Our churn is low" without a number.

**15. Cap Table**
Is your cap table clean, with no unexpected complexity (SAFEs, convertibles, side letters)?
✅ Pass: A clean cap table with founders, employees (ESOP pool), and any existing investors clearly shown.
❌ Fail: Multiple SAFEs with unclear conversion terms, or anyone on the cap table you'd have to explain.

**16. Use of Funds**
Have you defined exactly how you'll deploy the capital you're raising?
✅ Pass: Broken down by team, product, and go-to-market with assumptions.
❌ Fail: "We'll see what we need as we grow."`,
      },
      {
        heading: "Section 3: Legal & Structural Readiness (6 points)",
        body: `**17. Company Structure**
Is the company incorporated in the right structure for VC funding (Private Limited in India)?
✅ Pass: Pvt. Ltd. registered, CIN in hand.
❌ Fail: Proprietorship, LLP, or an entity that creates investor headaches.

**18. IP Assignment**
Have all founders and early employees assigned IP to the company?
✅ Pass: Signed IP assignment agreements on file.
❌ Fail: Code written before incorporation, or founders who haven't signed.

**19. Founder Agreements**
Do all founders have a formal shareholders' agreement with vesting?
✅ Pass: 4-year vest, 1-year cliff — or a clear departure from standard that's documented.
❌ Fail: No vesting, or handshake agreements only.

**20. ESOP Pool**
Have you set up an ESOP pool?
✅ Pass: Pool size defined, scheme documented.
❌ Fail: "We'll do it as part of the round."

**21. Compliance**
Are statutory filings up to date (ROC, GST, TDS, PT)?
✅ Pass: Nothing overdue; you have a CA managing this.
❌ Fail: You're not sure.

**22. Contracts**
Do you have signed contracts with your top 5 customers?
✅ Pass: MSAs or order forms in place, clearly defining commercial terms.
❌ Fail: Invoicing customers with no underlying agreement.`,
      },
      {
        heading: "Section 4: Product & Traction (8 points)",
        body: `**23. Core Metric**
Have you identified the one metric that best captures the value your product delivers?
✅ Pass: You track it weekly, it's in every investor update.
❌ Fail: You track 20 metrics equally.

**24. Growth Rate**
Is your MoM growth consistent (not driven by one spike)?
✅ Pass: 3+ months of consistent growth with a clear driver.
❌ Fail: One big month followed by flatness, with no explanation.

**25. Customer Interviews**
Have you done structured interviews with your top 10 customers in the last 90 days?
✅ Pass: Notes on file; you know exactly why they bought and what would make them leave.
❌ Fail: "We talk to customers all the time" — without structured data.

**26. NPS or Equivalent**
Do you have a quantified measure of customer love?
✅ Pass: NPS tracked quarterly; you know your score.
❌ Fail: "Customers love us" without data.

**27. Retention**
Do you track D30/M3/M12 retention for your product?
✅ Pass: Retention curves built and improving.
❌ Fail: You only track acquisition.

**28. Case Studies**
Do you have 2–3 specific customer success stories with before/after metrics?
✅ Pass: Written up, shareable with investors.
❌ Fail: Only anecdotes.

**29. Product Roadmap**
Is your roadmap driven by customer insight, not founder intuition?
✅ Pass: Roadmap tied to specific customer requests and retention/engagement data.
❌ Fail: Features added because the team wanted to build them.

**30. Demo**
Can you give a crisp 5-minute product demo that shows the core value prop without narrating every feature?
✅ Pass: You've practiced it ≥10 times; someone not from your team found it compelling.
❌ Fail: You're demoing features, not outcomes.`,
      },
      {
        heading: "Section 5: Team (4 points)",
        body: `**31. Founder-Market Fit**
Can you articulate clearly why this specific team is uniquely positioned to win in this market?
✅ Pass: Domain expertise, prior experience, or unfair distribution advantage.
❌ Fail: "We're fast learners."

**32. Gaps**
Do you know what you're missing and who you're planning to hire with the raise?
✅ Pass: Specific roles identified, criteria defined.
❌ Fail: "We'll hire good people."

**33. Advisor / Angel Network**
Do you have advisors or angels who add credibility and open doors?
✅ Pass: 1–2 named advisors with relevant domain expertise on your cap table or advisory board.
❌ Fail: No external validation of any kind.

**34. Founder Commitment**
Are all founders full-time with no conflicting obligations (other jobs, board seats, competing projects)?
✅ Pass: Everyone's fully committed.
❌ Fail: Part-time founders or unclear commitment.`,
      },
      {
        heading: "Section 6: Data Room (6 points)",
        body: `**35. Pitch Deck**
Is your pitch deck ≤15 slides, visually clean, and story-driven (not feature-list driven)?
✅ Pass: Investor gave feedback that the story was clear.
❌ Fail: Font soup, 20+ slides, or a deck that reads like a product brochure.

**36. One-Pager / Executive Summary**
Do you have a 1–2 page executive summary you can send before the deck?
✅ Pass: Covers: what, who, traction, team, ask. Under 500 words.
❌ Fail: You only have the full deck.

**37. Financial Model (Investor Version)**
Is your model clean enough to share? No broken formulas, no hardcoded numbers in the middle of ranges?
✅ Pass: Shared with one trusted advisor who confirmed it makes sense.
❌ Fail: You'd be embarrassed to share it as-is.

**38. MIS / Monthly Reports**
Do you send monthly investor updates (or would be ready to)?
✅ Pass: Template ready; you'd send these from day 1 post-close.
❌ Fail: No communication cadence established.

**39. Reference Customers**
Do you have 3 customers who would take a call from an investor on your behalf?
✅ Pass: Named, briefed, and have agreed to be references.
❌ Fail: You're not sure who would say yes.

**40. Data Room Folder**
Do you have a clean, organised Google Drive / Notion data room?
✅ Pass: Deck, model, legal docs, customer evidence — all accessible from one link.
❌ Fail: Files scattered across email threads.`,
      },
    ],
  },
  {
    slug: "pitch-deck-teardown",
    title: "Pitch Deck Teardown: What Works",
    description:
      "A detailed guide with real before/after examples of pitch decks, annotated with what changed and why.",
    price: 79900,
    tag: "guide",
    category: "fundraise",
    comingSoon: true,
    preview: "Coming soon — annotated before/after deck teardowns from real Indian fundraises.",
    sections: [],
  },

  // ─── STARTUP ─────────────────────────────────────────────────────────────────
  {
    slug: "first-10-customers-playbook",
    title: "First 10 Customers Playbook",
    description:
      "The exact outreach scripts, pricing conversations, and close tactics used to land the first 10 paying customers — without a brand, a case study, or an ad budget.",
    price: 59900,
    tag: "playbook",
    category: "startup",
    comingSoon: false,
    preview:
      "Scripts for cold outreach, discovery calls, objection handling, and pricing conversations — written for zero-proof-point situations.",
    sections: [
      {
        heading: "Why the first 10 are different",
        body: `The first 10 customers are not a scaled-down version of what comes later. They're a different game entirely.

Later, customers buy because others have. They trust your case studies, your brand, your reviews. In the beginning, they're buying *you* — your credibility, your conviction, your ability to make them feel like this is worth the risk.

Most founders try to skip to the end: deck, landing page, ad. That's a mistake. The first 10 require direct, human selling. No shortcuts.

This playbook is built for B2B SaaS and services with deal sizes between ₹5K and ₹5L/year. Adjust for your context.`,
      },
      {
        heading: "The List: Who to Target First",
        body: `Before you write a single message, build a list of 50 potential first customers. Not 10 — 50. You'll convert roughly 20%, so you need the pipeline.

**Tier 1: Warm network (prioritise)**
- Former colleagues at companies that match your ICP
- Ex-classmates now in relevant roles
- LinkedIn connections you've actually met
- Founders you've helped or know through communities

**Tier 2: Adjacent network**
- Second-degree connections via mutual people you trust
- People who've engaged with your content (liked, commented, shared)
- Community members in your niche (Slack groups, WhatsApp groups, Twitter/X)

**Tier 3: Cold outreach**
- Only after you've exhausted Tiers 1 and 2
- Target companies with a specific trigger: they just raised, just hired for a relevant role, just launched a product in your space

**For each name on your list, document:**
- Name, company, role
- Why they're a fit (specific problem you think they have)
- Connection type (warm / lukewarm / cold)
- How you'll reach them (email / LinkedIn / intro)`,
      },
      {
        heading: "Outreach Scripts",
        body: `**Warm Network — Email:**

Subject: Quick question — [their company]

Hi [Name],

Hope you're well. I'm working on something new and you're literally the first person I thought of.

I'm building [Company] — [one-liner]. Given your work at [their company], I think you might be facing [specific problem] right now.

I'm not pitching you — I'd genuinely love 20 minutes to understand how you currently [solve the problem]. And if what I'm building is relevant, I'll show you.

Would Thursday or Friday work?

[Your name]

---
**Note:** "I'm not pitching you" does two things: (1) it lowers their guard, (2) it sets up a discovery call, not a sales call. You learn more in discovery calls.

---
**Lukewarm — LinkedIn:**

Hi [Name] — we met at [event / via mutual] a while back.

I'm building [Company] — [one-liner]. I think [their company] might be an interesting fit because [specific reason].

Would you be open to a 15-minute call? I'd genuinely love your take on the problem before I sell anything.

---
**Cold — Email (only after warm channels exhausted):**

Subject: [Specific trigger: "Saw your recent hire for [role]"]

Hi [Name],

Noticed [Company] recently [trigger event]. That usually means [implication — the problem your product solves].

I'm building [Company] — [one-liner]. We're early, which means you'd be a design partner with direct input on the product, not just a customer.

Worth 20 minutes?

[Your name]`,
      },
      {
        heading: "The Discovery Call",
        body: `**Structure (20–25 minutes):**

**Opening (2 min):**
"Thanks for making time. I want to be upfront — I'm early-stage and I'm talking to [X] people this week to understand the problem before I sell anything. So this is more of a learning conversation. Is that ok?"

This resets the dynamic. They relax. You get honest answers.

---
**Discovery questions (10–12 min):**
1. "Walk me through how you currently handle [the thing your product does]."
2. "What's the most painful part of that process?"
3. "How often does it come up?"
4. "What have you tried? Why didn't that work?"
5. "If you could wave a magic wand and fix one thing about this, what would it be?"
6. "What would it mean for you personally if this was solved?"

**Don't interrupt. Don't pitch. Just listen and follow up with "tell me more."**

---
**The pivot (5 min):**
Only after you've genuinely listened:

"Based on what you've described — [summarise their problem back to them in their words] — that's exactly what [Company] is built for. Can I show you quickly?"

---
**The close (3–5 min):**
"Would this be useful for you?"

If yes: "We're working with our first 10 customers as design partners. That means you get the product at [X]% of the eventual price, you have direct access to me, and your feedback shapes the roadmap. The cost is ₹[X] for [period]. Does that work?"

**Don't offer a free trial. Don't offer a pilot. Ask for money.**`,
      },
      {
        heading: "Handling Objections",
        body: `**"Can I see a case study first?"**

"I don't have one yet — you'd be one of the first. That's actually why I'm offering design partner pricing. The upside for you is you get to shape the product. Most of our best features will come from conversations like this one."

---
**"Can we start with a free trial?"**

"I don't do free trials — not because I don't believe in the product, but because I've found that paid customers get 10x more value. When you've paid, you use it properly. Can we do ₹[X] for the first month with a full refund if it's not what I described?"

---
**"Your product is too early / you don't have all the features we need"**

"What's the one feature you'd need to see to move forward? If I can build it in [X weeks], would you commit today?"

---
**"I need to think about it"**

"Of course. What specifically would you need to see to feel confident? [Listen.] If I can address that, would you be ready to go?"

Never end a call without a specific next step — a date, a deliverable, or a clear "no."

---
**"It's too expensive"**

"What budget does make sense for solving [the problem]?" [Let them anchor.]

If their number is workable: "I can work with ₹[X] for the first [period] — but I'd want a 6-month commitment so I can actually build something meaningful for you. Does that work?"`,
      },
      {
        heading: "After They Say Yes",
        body: `**Invoice immediately.** Don't wait. Send the invoice within 30 minutes of a verbal yes. Use Razorpay, Instamojo, or a simple payment link. Deals that don't get invoiced same-day close at 50% the rate.

**Onboard personally.** Your first 10 customers get a 1:1 onboarding call with you. Not a Loom. Not a doc. You.

**Set up a communication channel.** A shared WhatsApp group or Slack channel. Direct access to you. This is the design partner relationship — use it.

**Ask for a referral.** After your first delivery milestone: "If this has been useful, is there one person at [peer company] you could introduce me to?" The first 10 customers are your most powerful distribution if they're happy.

**Send a monthly update.** Even if it's 3 bullet points. Keep them in the loop. Customers who feel like insiders don't churn.`,
      },
    ],
  },
  {
    slug: "hiring-your-first-5",
    title: "Hiring Your First 5: The Startup Hiring Playbook",
    description:
      "Job descriptions, interview scorecards, offer letter templates, and the questions that actually predict performance for early-stage hires.",
    price: 49900,
    tag: "playbook",
    category: "startup",
    comingSoon: false,
    preview:
      "Includes: JD templates for engineer/PM/growth roles, a structured scorecard, offer letter template, and 40 interview questions sorted by role.",
    sections: [
      {
        heading: "Who to hire first (and who to wait on)",
        body: `**The trap:** hiring people who look good on paper instead of people who solve your actual problem.

**The rule:** your first 5 hires should be people who can own a problem entirely — not people who need to be managed.

**Hire first:**
- Someone who can extend your technical capability (if you're not technical) or your go-to-market capability (if you are)
- The role where your absence is the biggest bottleneck

**Wait on:**
- Specialists (data scientists, designers, legal) — use contractors until the work is consistent enough to justify full-time
- Managers — you don't need management layers at 5 people
- "Good to have" roles — only hire when you can articulate the specific outcome you expect in 90 days

**The 90-day test:** Before posting any role, write the sentence: "In 90 days, I'll know this hire worked if [specific, measurable outcome]." If you can't write that sentence, you're not ready to hire for the role.`,
      },
      {
        heading: "Job Description Templates",
        body: `**Full-Stack Engineer (Founding Engineer)**

We're [Company] — [one-liner]. We've hit [traction]. We're building [X] and we need someone who can own the backend/frontend and not wait to be told what to build.

**What you'll do:**
- Own [specific product area] end-to-end
- Ship weekly — we move fast and you'll be expected to keep up
- Talk directly to customers and translate feedback into features

**What we're looking for:**
- [X]+ years building production systems (not just side projects)
- Strong opinions about code quality, with the pragmatism to ship anyway
- You've worked in a small team before — you know what it's like when there's no hand-holding

**What we offer:**
- ₹[X]–[X]L CTC + ESOP
- Direct access to founders, no bureaucracy
- The chance to shape something from [current stage] to [next stage]

---
**Growth / Marketing (First Marketer)**

We have product-market fit and [traction]. Now we need to grow. We're looking for someone who can run experiments, not just write briefs.

**What you'll do:**
- Own user acquisition — figure out what works, double down, kill what doesn't
- Run [channels: SEO / paid / content / partnerships] with a clear ROI lens
- Build the growth function from scratch

**What we're looking for:**
- You've grown something before — a product, a channel, a community
- You're comfortable with numbers (not just vibes-based marketing)
- You've worked without a big team or big budget

**What we offer:**
- ₹[X]–[X]L CTC + ESOP
- Direct line to founders, real ownership`,
      },
      {
        heading: "Interview Scorecard",
        body: `Rate each dimension 1–5. Hire if average ≥ 3.5 with no single dimension below 2.

**Dimension 1: Problem-Solving (1–5)**
Ask: "Tell me about the hardest technical / business problem you've solved. Walk me through your thinking."
1 = Could not explain their approach
3 = Solved it, but process was unclear
5 = Clear diagnosis, creative solution, learned from it

**Dimension 2: Ownership (1–5)**
Ask: "Tell me about a time something failed at work that was partly your fault. What happened?"
1 = Deflected blame entirely
3 = Acknowledged their role, limited reflection
5 = Clear ownership, specific learning, different outcome next time

**Dimension 3: Speed (1–5)**
Ask: "What's the fastest you've shipped something significant? What corners did you cut and were they the right ones?"
1 = Has never shipped fast or values polish over speed
3 = Can move fast when required
5 = Speed is default, with clear judgment about when to slow down

**Dimension 4: Communication (1–5)**
Observed throughout the conversation.
1 = Unclear, verbose, hard to follow
3 = Clear but passive — waits to be asked
5 = Crisp, proactive, calibrates to audience

**Dimension 5: Role Fit (1–5)**
Ask: "What would you do in the first 30 days in this role?"
1 = Generic answer, no research done
3 = Reasonable plan, not specific to our context
5 = Specific, shows they've thought about our actual problem`,
      },
      {
        heading: "40 Interview Questions by Role",
        body: `**For Engineers:**
1. What's the codebase you're proudest of? Walk me through one architectural decision you made.
2. Tell me about a production incident. What happened? What did you learn?
3. How do you decide when code is "good enough" to ship vs. needs more work?
4. What does your debugging process look like when you have no idea what's wrong?
5. Describe a time you pushed back on a feature request from a PM or founder. Were you right?
6. What's a technology or approach you changed your mind about?
7. How do you think about testing in a fast-moving startup?
8. What would you build in the first 30 days if we gave you full ownership of [specific area]?
9. Tell me about a time you had to learn a new technology quickly under pressure.
10. What kind of work environment makes you worst?

**For Growth / Marketing:**
1. What's the most creative acquisition experiment you've run? What happened?
2. How do you think about attribution when it's murky?
3. Tell me about a channel you tried that didn't work. What did you learn?
4. What's your framework for prioritising channels when budget is limited?
5. Walk me through how you'd approach growing [our specific metric] in the next 90 days.
6. How do you know when to kill an experiment vs. give it more time?
7. Tell me about the best copy you've written. Why did it work?
8. How do you stay close to what customers actually care about?
9. What's a growth strategy you thought would work but didn't?
10. How do you think about brand vs. performance at the early stage?

**For Operations / Generalists:**
1. Tell me about a process you inherited that was broken. What did you do?
2. Describe a time you had to coordinate across multiple teams to deliver something. What went wrong?
3. How do you think about prioritisation when everything is urgent?
4. Tell me about a time you had to make a decision with incomplete information.
5. What tools do you use to stay organised? Show me.
6. Describe a time you had to tell someone senior that they were wrong.
7. What does "good execution" mean to you?
8. Tell me about a time you improved a metric that wasn't your direct responsibility.
9. How do you think about documentation at an early-stage startup?
10. What's something you've built from scratch (process, team, function)?

**Culture / Fit (all roles):**
1. What made you leave your last role?
2. What's the environment where you do your best work?
3. Tell me about a manager who made you better. What did they do?
4. What are you still figuring out professionally?
5. What would your last team say is your biggest weakness?
6. What does ownership mean to you?
7. Tell me about a time you were wrong about something you cared about.
8. What do you do when you're stuck?
9. What are you reading / learning right now?
10. What are you looking for in your next role that you won't compromise on?`,
      },
      {
        heading: "Offer Letter Template",
        body: `**[Date]**

Dear [Name],

We're delighted to offer you the position of [Role] at [Company].

**Compensation:**
- Fixed CTC: ₹[X] per annum
- Variable (if applicable): ₹[X] per annum, tied to [specific metric]
- ESOP: [X] options vesting over 4 years with a 1-year cliff, at a strike price of ₹[X] per share

**Start Date:** [Date]

**Probation:** This offer is subject to a [90-day] probation period, during which either party may terminate with [2 weeks] notice.

**Notice Period:** [30 / 60] days post-probation.

**Joining Bonus (if applicable):** ₹[X], payable with your first salary, subject to 12-month retention clause.

**Conditions:**
This offer is contingent on satisfactory reference checks and submission of required documents.

We believe you're someone who will make [Company] significantly better. We don't offer this to everyone.

Please confirm your acceptance by [date].

Looking forward to building together.

[Founder name]
[Company]

---
**A note on ESOP conversations:**
When a candidate asks about ESOP value, don't oversell. Say: "Our current valuation is ₹[X]Cr. Your [X] options represent [X]% of the company on a fully diluted basis. At our target exit of ₹[X]Cr, that's ₹[X] — but I'd rather you value it at zero and be pleasantly surprised."

Founders who oversell ESOP create resentment when reality hits. Be conservative.`,
      },
    ],
  },
  {
    slug: "product-spec-templates",
    title: "Product Spec Templates",
    description:
      "PRD templates, user story frameworks, and feature prioritisation scorecards for early-stage product teams that don't have the luxury of a dedicated PM.",
    price: 39900,
    tag: "templates",
    category: "startup",
    comingSoon: false,
    preview:
      "Includes: 1-page PRD template, RICE scoring sheet, user story template, and a sprint planning framework for 2-person teams.",
    sections: [
      {
        heading: "Why most startup PRDs fail",
        body: `Most PRDs written by early-stage founders are too long, too vague, or both.

A PRD is not a requirements document for engineers to follow blindly. It's a shared understanding of *why* something is being built and *what success looks like*. Everything else is an implementation detail.

The template below is designed to be completed in 30 minutes. If it takes longer, you haven't thought clearly enough about the problem yet.`,
      },
      {
        heading: "1-Page PRD Template",
        body: `**Feature Name:** [Short, descriptive]
**Author:** [Your name]
**Date:** [Date]
**Status:** Draft / Review / Approved

---
**Problem (1–2 sentences)**
What problem does this solve? Be specific about *who* has the problem and *when* they encounter it.

Example: "B2B customers who have 3+ team members lose context when handing off tasks. Currently they either over-communicate via Slack or tasks get dropped."

---
**Why now (1 sentence)**
Why is this the right time to build this, vs. 3 months ago or 3 months from now?

---
**Success Metrics (2–3 metrics)**
How will you know this worked?
- Primary: [Metric] changes from [X] to [Y] within [timeframe]
- Secondary: [Metric]
- Guardrail: [Metric that should NOT get worse]

---
**Who it's for (User Story)**
As a [user type], when I [context/trigger], I want to [action] so that [outcome].

---
**What we're building (Feature Description)**
A few bullets. What does the feature do? What does it *not* do?

**In scope:**
-
-

**Out of scope (explicitly):**
-
-

---
**Edge Cases / Open Questions**
List anything unresolved. Don't hide ambiguity — surface it.

---
**Design / Technical Notes**
Any constraints, existing patterns to follow, or dependencies.

---
**Launch Plan**
Who needs to know? Any comms, documentation, or onboarding needed at launch?`,
      },
      {
        heading: "RICE Prioritisation Scorecard",
        body: `Use this to compare features objectively. Score each dimension, calculate the RICE score, rank your backlog.

**RICE = (Reach × Impact × Confidence) / Effort**

---
**Reach:** How many users/customers does this affect per quarter?
- Fewer than 10% of users = 1
- 10–25% = 2
- 25–50% = 3
- 50–75% = 4
- 75%+ = 5

**Impact:** How much does this move the needle for affected users?
- Minimal = 0.25
- Low = 0.5
- Medium = 1
- High = 2
- Massive = 3

**Confidence:** How confident are you in your estimates?
- Low (gut feel only) = 50%
- Medium (some data) = 80%
- High (strong data / tested) = 100%

**Effort:** How many person-weeks to build, test, and ship?
- < 1 week = 1
- 1–2 weeks = 2
- 2–4 weeks = 3
- 1–2 months = 5
- 2+ months = 8

---
**Example:**
Feature: In-app task assignments
Reach: 3 (40% of users)
Impact: 2 (high)
Confidence: 80%
Effort: 2 weeks = 2

RICE = (3 × 2 × 0.8) / 2 = **2.4**

Build a table with all your candidate features, calculate their scores, sort by RICE descending. Then gut-check: does the ranking feel right? If not, your estimates are off — adjust them.`,
      },
      {
        heading: "User Story Framework",
        body: `**The format:**
As a [persona], when [context/trigger], I want to [action/goal] so that [outcome/benefit].

**Why the trigger matters:** Most user stories skip the "when" — which means they describe a feature without anchoring it in a real moment. The trigger is what makes a story useful for design and engineering.

---
**Examples:**

❌ Weak: "As a user, I want to export my data."
✅ Strong: "As a team admin, when I'm offboarding an employee, I want to export all their task history to CSV so that I have a record before revoking access."

❌ Weak: "As a user, I want notifications."
✅ Strong: "As a customer using the mobile app, when a task I'm assigned is updated by a teammate, I want a push notification so that I can respond without checking the app constantly."

---
**Acceptance Criteria Format:**

For each user story, define acceptance criteria in Given/When/Then format:

Given [precondition],
When [action],
Then [expected result].

Example:
Given I am a team admin with export permissions,
When I click "Export" on a completed project,
Then a CSV file is downloaded containing all tasks, assignees, and completion dates from that project.

---
**The "So What" test:**
Read your acceptance criteria and ask: "So what?" If the answer is "nothing useful changes for the user," the criteria is too technical. Rewrite it in terms of user outcomes, not system states.`,
      },
      {
        heading: "Sprint Planning for 2-Person Teams",
        body: `You don't need Jira. You don't need velocity points. You need to ship the right thing every week.

**The weekly ritual (30 minutes, Monday morning):**

**Step 1: Review last week (5 min)**
- What shipped?
- What didn't? Why?
- Anything to carry forward?

**Step 2: Define this week's single most important outcome (5 min)**
One sentence: "By Friday, [X] will be true that isn't true today."

This is your north star for the week. Everything else is secondary.

**Step 3: Pick tasks that serve the outcome (15 min)**
Write tasks in "Ship X", "Fix Y", "Talk to Z customers about A" format. Not more than 10 tasks total.

For each task, write the acceptance criteria in one sentence.

**Step 4: Identify blockers before you start (5 min)**
What could prevent you from shipping the weekly outcome? Resolve or flag it now, not on Friday.

---
**The Thursday check-in (10 minutes):**
- Are we on track for the weekly outcome?
- What's at risk?
- What do we cut if we have to?

---
**The Friday retro (15 minutes):**
Three questions:
1. Did we hit the weekly outcome? If not, what happened?
2. What slowed us down that we could fix?
3. What was the best decision we made this week?

The retro is not a post-mortem. It's a calibration. Keep it short; act on one thing per week.`,
      },
    ],
  },
  {
    slug: "growth-experiment-tracker",
    title: "Growth Experiment Tracker & Playbook",
    description:
      "A structured system for running, tracking, and learning from growth experiments — with 30 pre-built experiment ideas across SEO, paid, content, and referral.",
    price: 44900,
    tag: "playbook",
    category: "startup",
    comingSoon: false,
    preview:
      "Experiment log template, hypothesis framework, ICE scoring, and 30 battle-tested experiment ideas across channels.",
    sections: [
      {
        heading: "The problem with most growth \"experiments\"",
        body: `Most startups don't run experiments. They run activities and hope.

An experiment has:
1. A clear hypothesis ("If we do X, Y will happen because Z")
2. A defined success metric, measured before and after
3. A time-bounded test window
4. A decision rule: what result would cause you to scale, kill, or iterate?

Without these four elements, you're spending time and money on hope.

This playbook gives you the framework and the ideas. The discipline is on you.`,
      },
      {
        heading: "Experiment Log Template",
        body: `**Experiment #[N]**

**Name:** [Short descriptive name]
**Date started:** [Date]
**Date ended / review date:** [Date]
**Owner:** [Who's running it]

**Hypothesis:**
If we [action/change], then [metric] will [increase/decrease] by [X]% because [mechanism/reason].

**Channel:** SEO / Paid / Content / Email / Referral / Product / Partnerships / Other

**ICE Score:**
- Impact (1–10): How much will this move the needle if it works?
- Confidence (1–10): How sure are you it will work?
- Ease (1–10): How easy is this to run?
- **ICE Total:** (Impact + Confidence + Ease) / 3

**What we'll measure:**
- Primary metric:
- Secondary metric:
- Baseline (before):
- Target (after):
- Measurement method:

**What we're building / doing:**
[2–3 bullet description of the actual work]

**Results:**
- Primary metric result:
- Secondary metric result:
- Qualitative observations:

**Decision:**
☐ Scale — it worked, double down
☐ Iterate — promising signal, change [X] and retest
☐ Kill — no signal, move on
☐ Inconclusive — run longer / with more volume

**What we learned:**
[Most important insight, even from failures]`,
      },
      {
        heading: "30 Pre-Built Experiment Ideas",
        body: `**SEO (Experiments 1–7)**

1. **Long-tail blog cluster**
Write 5 articles targeting long-tail keywords in a tight cluster (e.g., "how to [specific task] for [specific ICP]"). Measure: organic traffic to those pages at Day 60.

2. **Programmatic landing pages**
Create 20–50 location- or use-case-specific landing pages (e.g., "[Product] for [city]" or "[Product] for [industry]"). Measure: SEO traffic + conversion rate vs. homepage.

3. **Competitor comparison pages**
Build "[Your product] vs. [competitor]" pages targeting people actively comparing options. Measure: traffic + trial/demo conversions.

4. **FAQ schema markup**
Add FAQ schema to your top 10 pages. Measure: click-through rate change in Search Console.

5. **Internal linking audit**
Add internal links from your 5 highest-traffic pages to your 5 highest-converting pages. Measure: assisted conversions from those pages.

6. **Title tag A/B test**
Rewrite the title tags of your top 20 pages to be more action-oriented. Measure: CTR change in GSC at 30 days.

7. **Content refresh**
Pick your top 5 pages by traffic that haven't been updated in 6+ months. Refresh them with new data, examples, and internal links. Measure: ranking changes at 45 days.

---
**Paid (Experiments 8–14)**

8. **Competitor keyword bidding**
Bid on your top 3 competitors' brand names with a "switching" angle. Measure: CPC, conversion rate, and CAC vs. non-brand campaigns.

9. **Value prop A/B test**
Run two ad sets with different primary value propositions (e.g., "saves time" vs. "reduces errors"). Same audience, same creative format. Measure: CTR + conversion rate.

10. **ICP micro-targeting**
Create one hyper-specific ad set targeting a narrow ICP (e.g., "VP of Ops at Indian SaaS companies 50–200 employees"). Compare CAC to broad targeting.

11. **Retargeting with social proof**
Show ads with a customer quote or case study stat to anyone who visited your pricing page but didn't convert. Measure: conversion rate vs. non-retargeted visitors.

12. **Landing page vs. homepage**
Split traffic 50/50 between your homepage and a dedicated landing page. Measure: signup/trial conversion rate.

13. **Video ad vs. static**
Run the same offer as a 30-second video and a static image. Same audience. Measure: CPM, CTR, conversion rate.

14. **Lead magnet funnel**
Offer a free resource (checklist, template) as the ad CTA, then nurture to trial. Measure: lead-to-trial conversion rate vs. direct trial CTAs.

---
**Content & Email (Experiments 15–21)**

15. **Newsletter subject line test**
A/B test subject lines for your next 4 newsletters (same content, different subject). Measure: open rate difference.

16. **Plain text vs. designed emails**
Send the same email as plain text to half your list, designed to the other half. Measure: open rate, click rate, reply rate.

17. **Reactivation email sequence**
Send a 3-email sequence to users who signed up but never activated. Measure: reactivation rate.

18. **Customer story as content**
Write up one customer's journey with your product (with permission) as a detailed case study. Distribute across blog, email, LinkedIn. Measure: inbound leads sourced to that asset at 30 days.

19. **Weekly email cadence vs. monthly**
Switch from monthly to weekly emails for one quarter. Measure: open rate trend, unsubscribe rate, click rate.

20. **"Reply to this email" CTA**
Add a direct question + "reply to this email" CTA to your next 4 newsletters. Measure: reply rate and quality of responses.

21. **Free tool or calculator**
Build one free tool or calculator relevant to your ICP (e.g., "CAC calculator", "SLA uptime cost calculator"). Measure: organic traffic + lead capture at 60 days.

---
**Referral & Partnerships (Experiments 22–26)**

22. **Net Promoter Score ask + referral**
After NPS survey response (score 9–10), immediately ask: "Would you refer a colleague?" with a one-click option. Measure: referral conversion rate.

23. **Power user referral program**
Identify your top 10 most engaged users. Reach out personally with a referral incentive. Measure: referrals generated per user.

24. **Integration partnership**
Partner with one non-competing product your ICP already uses. Cross-promote to each other's email lists. Measure: signups from partner traffic.

25. **Community sponsorship**
Sponsor one relevant Slack community, WhatsApp group, or newsletter for 4 weeks. Measure: signups + CAC vs. paid channels.

26. **Customer co-marketing**
Partner with a happy customer to write a joint article / case study / webinar. Measure: leads generated from the content.

---
**Product-Led Growth (Experiments 27–30)**

27. **Activation email sequence**
Add a 5-email drip to new signups over 7 days, each focused on one core action. Measure: Day 7 activation rate before vs. after.

28. **In-product social proof**
Show "X companies like yours use [feature]" inside the product. Measure: feature adoption rate.

29. **Empty state prompts**
Replace blank/empty states in your product with specific CTAs or examples. Measure: time-to-first-action for new users.

30. **Upgrade prompt timing test**
Test showing the upgrade prompt at 3 different moments in the user journey. Measure: upgrade conversion rate by trigger.`,
      },
    ],
  },
  {
    slug: "founder-weekly-operating-system",
    title: "Founder Weekly Operating System",
    description:
      "A planning and review system for solo founders and small teams — weekly review template, OKR framework, decision log, and a meeting structure that doesn't waste everyone's time.",
    price: 34900,
    tag: "templates",
    category: "startup",
    comingSoon: false,
    preview:
      "Weekly review template, quarterly OKR framework, 1:1 agenda template, decision log, and a daily planning format for founders.",
    sections: [
      {
        heading: "Why most founders work hard and make slow progress",
        body: `Working hard and making progress are not the same thing.

The founders who move fastest are not working more hours. They're working on the right things consistently, reviewing what's working honestly, and making decisions quickly.

This system takes about 45 minutes per week. It's designed to force three habits:
1. **Clarity on the one thing that matters most this week**
2. **Honest review of what actually happened (not what you wish happened)**
3. **A short written record of important decisions, so you stop relitigating them**

None of this is complicated. The hard part is doing it every week without skipping.`,
      },
      {
        heading: "Weekly Review Template (30 minutes, Sunday evening)",
        body: `**Date:** [Week of: ]

---
**Section 1: Last week (10 minutes)**

What was the single most important thing I said I'd do? Did I do it?
[ ] Yes — [what happened]
[ ] No — [honest reason why not]

What were the 3 biggest outcomes from last week?
1.
2.
3.

What didn't get done that I expected to?
-
-

What did I learn that changes how I'll approach something?

---
**Section 2: This week (15 minutes)**

**The one thing:** What's the single most important outcome I need this week? (One sentence. One outcome.)

If I achieve only one thing this week, it's: _______________

**This week's tasks:**
(List no more than 10. Each task should be completable in < 1 day. If a task takes > 1 day, break it down.)

Monday:
Tuesday:
Wednesday:
Thursday:
Friday:

**This week's blockers / risks:**
What could prevent me from hitting the one thing? What's my plan?

---
**Section 3: Energy and focus (5 minutes)**

My energy level going into this week: 1–10 = ___

What will protect my focus this week? (e.g., blocking calendar, saying no to X, limiting Slack)

What am I avoiding that I need to do?`,
      },
      {
        heading: "Quarterly OKR Framework for Early-Stage Startups",
        body: `**The setup:**
One company-level objective. 3 key results. Revisited weekly for 5 minutes. Reviewed honestly at quarter end.

That's it. If you have more than one objective, you don't have a strategy — you have a list.

---
**Objective format:**
"By [quarter end], [Company] will [qualitative, inspiring goal]."

Examples:
- "By Q3 end, Finly will be the go-to tool for Indian D2C finance teams."
- "By Q4 end, we'll have proven we can grow without paid acquisition."

**Key Result format:**
"[Metric] will go from [baseline] to [target]."

Examples:
- ARR will go from ₹8L to ₹20L
- D30 retention will go from 34% to 50%
- CAC from organic channels will drop from ₹4,000 to ₹1,500

---
**The weekly OKR check-in (5 minutes, Monday):**
For each KR:
- Current number:
- On track? Y / N / At risk
- What's driving it?
- What's the one action this week that moves it most?

---
**Quarter-end review template:**

**Objective:** [Restate it]

For each KR:
- Target:
- Actual:
- Score (0.0–1.0): [0.7 is a good result; 1.0 means you set it too easy]
- What drove the result?
- What would we do differently?

**Overall:**
- What did we learn about our business this quarter?
- What assumption did we get wrong?
- What's the most important thing to carry into next quarter?`,
      },
      {
        heading: "1:1 Agenda Template",
        body: `Use this for weekly 1:1s with your first hires. Keep it to 25–30 minutes. Don't skip it.

**Before the meeting:**
Both people answer these in writing, 15 minutes before:
1. What's going well?
2. What's stuck / frustrating?
3. What do you need from me this week?

---
**Meeting structure:**

**0–5 min: Quick check-in**
How are you actually doing? (Not work — person.)

**5–15 min: Their agenda**
They go first. What's on their mind? What do they want help with?

**15–22 min: Your agenda**
Feedback, priorities, anything they need to know.

**22–28 min: Next week**
What's the one most important thing for them to move this week?

**28–30 min: Close**
Anything else? Anything uncomfortable that didn't get said?

---
**What not to do in 1:1s:**
- Don't use them for status updates (use async for that)
- Don't skip them when you're busy — that's exactly when they matter most
- Don't do all the talking
- Don't wait for the 1:1 to give feedback — give it in the moment, use 1:1 to follow up`,
      },
      {
        heading: "Decision Log Template",
        body: `One of the most expensive things a startup does is relitigate decisions. A decision log stops this.

Write every significant decision in this format. Takes 5 minutes. Saves hours of repeated debate.

---
**Decision:** [What we decided]

**Date:** [Date]

**Who decided:** [Name(s)]

**Context:** What situation prompted this decision?

**Options considered:**
1.
2.
(3.)

**Why we chose [option]:**
[2–3 sentences. Include the key trade-off.]

**What would change our minds:**
Under what circumstances would we revisit this?

**Review date (optional):** [If this is a time-sensitive or uncertain decision, set a date to review it]

---
**Where to keep it:**
A shared Notion page or Google Doc. Indexed by date and topic. Searchable.

When someone raises a debate you've had before, link them to the entry instead of repeating the conversation. If the context has changed enough to warrant re-opening it, update the log — don't just discuss and forget again.

**Decisions worth logging:**
- Pricing changes
- Hiring decisions (and why you didn't hire candidates you seriously considered)
- Major product direction changes
- Choosing not to pursue a customer or market segment
- Choosing a tech stack or vendor
- Any decision the team disagreed about`,
      },
    ],
  },

  // ─── FUNDRAISE — LEGAL & DEAL DOCS ───────────────────────────────────────────
  {
    slug: "term-sheet-template",
    title: "Term Sheet (CCD, CCPS, Equity, SAFE)",
    description:
      "Ready-to-use term sheet templates for the four most common Indian fundraising instruments — Compulsorily Convertible Debentures, Preference Shares, Equity, and SAFE notes.",
    price: 299900,
    tag: "legal",
    category: "fundraise",
    comingSoon: false,
    preview: "Four instrument-specific term sheets, annotated with negotiation notes on each key clause.",
    sections: [
      {
        heading: "CCD Term Sheet Template",
        body: `**TERM SHEET — COMPULSORILY CONVERTIBLE DEBENTURES**

Date: [DATE]
Issuer: [COMPANY NAME], a Private Limited Company incorporated under the Companies Act, 2013 (CIN: [CIN])
Investor: [INVESTOR NAME / FUND NAME]

---
**1. Instrument**
Compulsorily Convertible Debentures (CCDs) that shall convert into equity shares of the Company upon occurrence of a Conversion Event or at the option of the Investor.

**2. Investment Amount**
₹[AMOUNT] (Rupees [IN WORDS] only)

**3. Valuation**
Pre-money valuation: ₹[AMOUNT] Cr (fully diluted)
Post-money valuation: ₹[AMOUNT] Cr

**4. Conversion**
The CCDs shall compulsorily convert into equity shares of the Company:
(a) upon the occurrence of a Qualified Financing (defined as raising ≥ ₹[X] Cr from institutional investors); or
(b) at the end of [X] months from the date of issuance, whichever is earlier.

**5. Conversion Price**
Lower of: (a) pre-money valuation at Qualified Financing ÷ fully diluted shares, or (b) ₹[X] per share (cap), subject to a [X]% discount.

**6. Interest**
[X]% per annum, simple interest, payable at conversion or redemption.

**7. Anti-Dilution**
Broad-based weighted average anti-dilution protection.

**8. Board Representation**
Investor shall have the right to nominate one (1) Director / Observer to the Board of Directors.

**9. Information Rights**
Monthly MIS within 15 days of month-end; audited financials within 90 days of year-end.

**10. Conditions Precedent**
(a) Completion of legal due diligence to Investor's satisfaction
(b) Execution of Debenture Subscription Agreement and SHA
(c) Board and shareholder approvals
(d) Regulatory filings as applicable

---
*This term sheet is non-binding except for clauses on exclusivity and confidentiality. It is subject to definitive documentation.*`,
      },
      {
        heading: "CCPS Term Sheet Template",
        body: `**TERM SHEET — COMPULSORILY CONVERTIBLE PREFERENCE SHARES**

Date: [DATE]
Issuer: [COMPANY NAME]
Investor: [INVESTOR NAME]

---
**1. Instrument**
Series [A/B/C] Compulsorily Convertible Preference Shares (CCPS)

**2. Investment Amount**
₹[AMOUNT] for [X] CCPS at a face value of ₹[X] each, at a premium of ₹[X] per share.

**3. Pre-Money Valuation**
₹[AMOUNT] Cr on a fully diluted basis

**4. Liquidation Preference**
[1x / 1.5x] non-participating liquidation preference. In a liquidation event, CCPS holders receive their investment back (plus accrued dividends if any) before equity shareholders.

**5. Anti-Dilution**
Broad-based weighted average. In the event of a down-round, the conversion ratio shall be adjusted accordingly.

**6. Dividend**
[X]% cumulative / non-cumulative preference dividend, payable before any dividend to equity holders.

**7. Conversion**
Each CCPS shall convert into [X] equity shares on: (a) IPO; (b) qualified institutional financing; or (c) [X] years from issuance, at the option of the majority CCPS holders.

**8. Protective Provisions**
Investor approval required for: (a) new securities issuance; (b) amendments to charter affecting CCPS rights; (c) related-party transactions above ₹[X]; (d) any M&A or liquidation event.

**9. ROFR / ROFO**
Existing CCPS holders have right of first refusal on any new securities issuance pro-rata to their holding.

**10. Drag Along**
If holders of ≥[X]% approve a sale, remaining shareholders shall be obligated to participate on the same terms.

**11. Tag Along**
CCPS holders shall have the right to tag along on any founder share sale exceeding [X]% of total shares.`,
      },
      {
        heading: "Equity Term Sheet Template",
        body: `**TERM SHEET — EQUITY INVESTMENT**

Date: [DATE]
Company: [COMPANY NAME]
Investor(s): [INVESTOR NAMES]

---
**1. Securities**
[X] equity shares at ₹[X] per share (face value ₹[X], premium ₹[X])

**2. Pre-Money Valuation**
₹[AMOUNT] Cr fully diluted

**3. Post-Money Capitalization Table**
| Shareholder | Shares | % |
|---|---|---|
| Founder 1 | [X] | [X]% |
| Founder 2 | [X] | [X]% |
| ESOP Pool | [X] | [X]% |
| Investor | [X] | [X]% |
| **Total** | **[X]** | **100%** |

**4. Use of Proceeds**
[X]% — Product & Engineering
[X]% — Sales & Marketing
[X]% — Team (Hiring)
[X]% — Operations & G&A

**5. Governance**
Board composition post-investment: [X] Founders + [X] Investor Director(s) + [X] Independent Director(s)

**6. Vesting**
All founder shares subject to reverse vesting: 4-year vest, 1-year cliff from company incorporation date. Unvested shares subject to buyback at face value upon departure.

**7. ESOP Pool**
[X]% fully diluted ESOP pool to be created / maintained pre-investment.

**8. Exclusivity**
Company agrees to a [30]-day exclusivity period from term sheet signing.

**9. Expenses**
Company to bear reasonable Investor legal fees (capped at ₹[X]).`,
      },
      {
        heading: "SAFE Note Template",
        body: `**SIMPLE AGREEMENT FOR FUTURE EQUITY (SAFE)**

Date: [DATE]
Company: [COMPANY NAME], a Private Limited Company
Investor: [INVESTOR NAME]
Investment Amount: ₹[AMOUNT]

---
**1. Events of Conversion**

**(a) Equity Financing:** Upon the next equity financing of ≥ ₹[X] Cr (Qualified Financing), this SAFE converts into the same class of shares issued to investors in that round, at the lower of:
- Discount Price: The price per share in the Qualified Financing × (1 - [20]%)
- Valuation Cap Price: ₹[X] Cr ÷ fully diluted pre-money cap table shares

**(b) Liquidity Event:** Upon M&A or IPO, the Investor receives the greater of: (i) investment amount × [1.5x], or (ii) the amount they would receive if the SAFE had converted to equity at the Valuation Cap.

**(c) Dissolution:** Upon winding up, Investor receives their investment back before any equity distribution, if funds are available.

**2. Valuation Cap**
₹[X] Cr (post-money)

**3. Discount Rate**
[20]%

**4. No Board Seat**
This SAFE does not grant voting rights or board representation until conversion.

**5. Pro-Rata Rights**
Investor has the right to invest up to their pro-rata share in the Qualified Financing round.

**6. MFN Clause**
If Company issues another SAFE with more favourable terms, this SAFE shall automatically be amended to match those terms.

---
*This SAFE is not a loan. There is no interest, no maturity date, and no obligation to repay unless a Dissolution Event occurs.*

*[Signature block]*`,
      },
      {
        heading: "Negotiation Notes — Key Clauses to Watch",
        body: `**Liquidation Preference**
- 1x non-participating is founder-friendly; push back hard on anything above 1x or participating preference
- Participating preference means investors get their money back AND participate in remaining proceeds — avoid

**Anti-Dilution**
- Broad-based weighted average: accounts for all outstanding shares including options — standard and acceptable
- Full ratchet: adjusts your price down to the lowest new share price — avoid at all costs
- Narrow-based: only counts issued shares — be cautious

**Valuation Cap (SAFE/CCD)**
- Negotiate the cap at 2–3x your expected next round valuation
- Too low a cap is worse than a higher discount rate — model both scenarios before agreeing

**Protective Provisions**
- Standard: veto on new share issuance, M&A, amendments to charter
- Watch out for: operational veto (new hires above ₹X, budget approvals) — push back
- Any approval threshold below simple majority is a red flag

**Information Rights**
- Monthly MIS is reasonable; quarterly audited financials is the minimum
- Resist any right that gives investors access to real-time systems or unaudited books

**Exclusivity**
- 30 days is standard; 45 is acceptable; never agree to 60+ days
- Ensure the clause has a "good faith" requirement on the investor's side too

**ESOP Pool**
- Investors will want the pool created pre-investment (dilutes founders more)
- Counter: create a smaller pool pre-investment and commit to topping up post-investment`,
      },
    ],
  },
  {
    slug: "valuation-methodologies",
    title: "Valuation Methodologies",
    description:
      "A practical guide to the valuation methods used in Indian startup funding rounds — DCF, comparables, scorecard, and VC method — with worked examples.",
    price: 149900,
    tag: "guide",
    category: "fundraise",
    comingSoon: false,
    preview: "Four valuation methods explained with worked examples, a comparison matrix, and guidance on which method to use when.",
    sections: [
      {
        heading: "Why Valuation Feels Arbitrary (And When It Isn't)",
        body: `At the early stage, valuation is negotiation dressed up as math. There is no objectively correct number. What matters is:
1. What comparable companies have raised at
2. What the investor's return requirements look like from their end
3. What dilution you can afford and still have enough to raise another round

That said, understanding the methods investors use lets you argue your number credibly — and spot when someone is lowballing you.

The four most relevant methods for Indian early-stage startups:
1. **Comparable Transactions (Comps)** — most commonly used in practice
2. **VC Method** — used by seed/early-stage institutional investors
3. **Scorecard Method** — used by angels and micro-VCs
4. **DCF (Discounted Cash Flow)** — rarely used pre-Series A, but you'll encounter it at growth stage`,
      },
      {
        heading: "Comparable Transactions Method",
        body: `**How it works:**
Value your company based on what similar companies have raised at, using revenue or ARR multiples.

**Formula:**
Valuation = Revenue Multiple × Current ARR (or projected ARR)

**Step 1: Find your comps**
- Same sector (fintech, SaaS, D2C, etc.)
- Similar stage (pre-seed, seed, Series A)
- Similar geography (Indian market or comparable emerging market)
- Similar growth rate (±30%)

Sources: Tracxn, Crunchbase, VCCEdge, public announcements

**Step 2: Calculate the multiple**
If a comparable SaaS company raised at ₹50 Cr valuation on ₹2.5 Cr ARR:
Multiple = 50 / 2.5 = **20x ARR**

**Step 3: Apply to your business**
Your ARR: ₹1.5 Cr
Comparable multiple: 20x
Indicated valuation: **₹30 Cr**

**Adjust for:**
- Growth rate (you're growing faster → premium; slower → discount)
- Team quality
- Market size
- Competitive moat

**Common multiples (India, 2024–25):**
- SaaS pre-Series A: 15–30x ARR
- D2C seed: 2–5x revenue
- Fintech seed: 10–20x revenue (adjusted for regulated nature)
- Consumer apps: often on engagement metrics, not revenue`,
      },
      {
        heading: "VC Method",
        body: `**How it works:**
Work backwards from the investor's required return.

**Formula:**
Post-money valuation = Exit Value ÷ Expected Multiple ÷ Dilution factor

**Step 1: Estimate exit value**
"In 7 years, what could this company be worth in an M&A or IPO?"
Example: You're building a B2B SaaS — similar companies have exited at ₹500–1,000 Cr.
Use: ₹750 Cr exit value

**Step 2: Investor's required return**
A seed fund investing ₹3 Cr expects 10–30x returns (accounting for portfolio failures).
Let's use 20x.

**Step 3: Calculate implied post-money**
Target return value = Investment × Multiple = ₹3 Cr × 20x = ₹60 Cr
Investor needs: ₹60 Cr / ₹750 Cr exit = 8% of the company at exit

**Step 4: Account for future dilution**
Between now and exit, you'll raise 2 more rounds. Each round dilutes ~20%.
Dilution factor: 0.8 × 0.8 = 0.64

Investor needs at entry: 8% ÷ 0.64 = 12.5% of company today

**Step 5: Back into the valuation**
If ₹3 Cr buys 12.5%, the post-money valuation = ₹3 Cr ÷ 0.125 = ₹24 Cr post-money

**Using this:**
- If investor offers ₹3 Cr at ₹15 Cr post-money (20% ownership), they need a 30x+ exit at ₹750 Cr — that math rarely works for a 1x fund. Push back.
- If they offer ₹3 Cr at ₹30 Cr post-money (10%), they need only 15x at exit — much more standard`,
      },
      {
        heading: "Scorecard Method & DCF Primer",
        body: `**SCORECARD METHOD (Angels / Micro-VCs)**

Used to adjust a regional baseline valuation based on qualitative factors.

Step 1: Start with average pre-money for comparable raises in your city/sector.
Example: Average seed raise in Bangalore B2B SaaS = ₹8 Cr pre-money

Step 2: Score your company on 6 factors (weight × score = adjustment):
| Factor | Weight | Your Score (0.5–1.5) | Adjustment |
|---|---|---|---|
| Team strength | 30% | 1.3 | +9% |
| Market opportunity | 25% | 1.2 | +5% |
| Product / Tech | 15% | 1.0 | 0% |
| Competition | 10% | 0.8 | -2% |
| Marketing / Sales | 10% | 1.1 | +1% |
| Need for investment | 10% | 0.9 | -1% |
| **Total** | 100% | | **+12%** |

Step 3: Apply adjustment
₹8 Cr × 1.12 = **₹8.96 Cr pre-money**

---

**DCF (GROWTH STAGE PRIMER)**

At Series B+, investors will model a DCF. Key inputs:
- 5–7 year revenue forecast
- EBITDA margin trajectory
- Terminal growth rate (3–5% for mature businesses)
- WACC (Weighted Average Cost of Capital) — typically 18–25% for Indian growth companies
- Terminal value = Year 7 EBITDA × EV/EBITDA multiple (12–18x for SaaS)

Don't lead with a DCF in early-stage pitches — it signals you don't understand how early-stage investing works.`,
      },
    ],
  },
  {
    slug: "transaction-documents",
    title: "Transaction Documents (SHA & SSA)",
    description:
      "Annotated templates for Shareholders' Agreement (SHA) and Share Subscription Agreement (SSA) — the two core legal documents in every Indian VC funding transaction.",
    price: 349900,
    tag: "legal",
    category: "fundraise",
    comingSoon: false,
    preview: "Full SHA and SSA templates with clause-by-clause annotation on what to negotiate, what to accept, and what to reject.",
    sections: [
      {
        heading: "SHA Key Clauses — Template & Annotation",
        body: `**SHAREHOLDERS' AGREEMENT (KEY CLAUSES)**

Between:
1. [COMPANY NAME] ("Company")
2. [FOUNDER 1 NAME] ("Founder 1")
3. [FOUNDER 2 NAME] ("Founder 2")
4. [INVESTOR NAME] ("Investor")

---
**CLAUSE 1 — DEFINITIONS**
"Qualified Financing" means an equity financing with aggregate proceeds of at least ₹[X] Cr from one or more institutional investors.
"Exit Event" means (a) an IPO; (b) a merger, acquisition, or consolidation resulting in a change of control; or (c) a sale of all or substantially all Company assets.

*Annotation: Define Qualified Financing carefully — if the threshold is too low, minor bridges trigger conversion rights.*

---
**CLAUSE 5 — BOARD COMPOSITION**
5.1 The Board shall consist of [X] Directors.
5.2 The Investor shall have the right to nominate [1/2] Director(s) to the Board.
5.3 The Founders collectively shall have the right to nominate [X] Directors.
5.4 [X] Independent Director(s) shall be appointed by mutual consent.

*Annotation: Ensure your nominees always constitute a majority unless you've sold >50% — protect the casting vote.*

---
**CLAUSE 8 — RESERVED MATTERS**
The following actions require prior written consent of the Investor:
(a) Issuance of any new shares or securities convertible into shares
(b) Any amendment to the constitutional documents of the Company
(c) Any related-party transaction exceeding ₹[X]
(d) Acquisition or disposal of assets exceeding ₹[X]
(e) Any change in the nature of business
(f) Declaration or payment of any dividend
(g) Any single capital expenditure exceeding ₹[X]

*Annotation: (g) is the most dangerous clause. Push for a high threshold — INR 50L+ at minimum for seed stage. Operational veto rights will strangle the company.*

---
**CLAUSE 12 — VESTING AND LEAVER PROVISIONS**
12.1 All Founder shares are subject to a 4-year vesting schedule with a 1-year cliff from [INCORPORATION DATE].
12.2 Good Leaver: Departure due to death, permanent disability, or termination without cause. Unvested shares revert to the Company at Fair Market Value.
12.3 Bad Leaver: Voluntary resignation or termination for cause within the vesting period. Unvested shares revert to the Company at face value (₹[X] per share).

*Annotation: "For cause" must be exhaustively defined. Ensure it requires a Board resolution to invoke — unilateral investor invocation is a red flag.*`,
      },
      {
        heading: "SHA Key Clauses — Transfer Restrictions",
        body: `**CLAUSE 14 — TRANSFER RESTRICTIONS**

**14.1 Lock-in**
No Founder shall transfer any shares during the Lock-in Period of [24/36] months from the Closing Date without prior written consent of the Investor.

*Annotation: Standard is 24 months for seed, 36 for Series A. Push back on anything longer.*

**14.2 Right of First Refusal (ROFR)**
Before transferring shares to any third party, the transferring shareholder shall offer the shares to existing shareholders pro-rata at the proposed transfer price. Existing shareholders shall have [30] days to exercise their ROFR.

**14.3 Co-Sale / Tag Along**
If a Founder proposes to sell shares to a third party, the Investor shall have the right to participate in such sale and sell a pro-rata portion of their shares on the same terms and at the same price.

**14.4 Drag Along**
If shareholders holding ≥ [75]% of the issued share capital (including the Investor) approve a sale of the Company, all other shareholders shall be obligated to sell their shares on the same terms.

*Annotation: Ensure drag-along requires at least one founder's approval as part of the [75]% threshold. A pure investor drag without founder sign-off can force a sale you don't want.*

**14.5 Anti-Dilution**
In the event of any issuance of shares at a price per share lower than the price paid by the Investor ("Down Round"), the conversion price of the Investor's securities shall be adjusted on a broad-based weighted average basis.

*Formula: New Conversion Price = CP × (A + B) ÷ (A + C)*
*Where: CP = Current Conversion Price; A = Fully diluted shares outstanding; B = Shares issuable for aggregate consideration at CP; C = Shares actually issued in Down Round*`,
      },
      {
        heading: "SSA Template — Core Structure",
        body: `**SHARE SUBSCRIPTION AGREEMENT**

This Share Subscription Agreement ("Agreement") is entered into on [DATE] between:

1. [COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] ("Company");
2. [FOUNDER 1] and [FOUNDER 2] (together, "Founders"); and
3. [INVESTOR NAME] ("Investor")

---
**ARTICLE 2 — SUBSCRIPTION**

2.1 The Investor agrees to subscribe to, and the Company agrees to allot and issue to the Investor, [X] [CCPS / Equity Shares / CCDs] at a price of ₹[X] per share, aggregating to a total subscription amount of ₹[AMOUNT] ("Subscription Amount").

2.2 The subscription shall be completed in [one / two] tranches:
- First Tranche: ₹[X] on the Closing Date
- Second Tranche: ₹[X] on achievement of [MILESTONE] (if applicable)

**ARTICLE 3 — CONDITIONS PRECEDENT**

3.1 The obligation of the Investor to subscribe is subject to:
(a) Satisfactory completion of legal, financial, and technical due diligence
(b) No material adverse change in the business since the date of the Term Sheet
(c) Execution of the SHA
(d) Board resolution approving the allotment
(e) Shareholders' resolution (special resolution) approving the issue
(f) Receipt of any regulatory approvals required under FEMA (for foreign investors)

**ARTICLE 4 — REPRESENTATIONS & WARRANTIES**

4.1 The Company and Founders represent and warrant that:
(a) The Company is duly incorporated and in good standing
(b) The Company has the corporate power and authority to enter into this Agreement
(c) No litigation, arbitration or regulatory proceeding is pending or threatened
(d) The financial statements provided accurately represent the Company's financial position
(e) The Company has complied with all applicable laws, including labour, tax, and IP laws
(f) The Company owns or has valid licenses to all IP used in the business

**ARTICLE 7 — INDEMNIFICATION**

7.1 The Founders shall indemnify the Investor against any loss arising from:
(a) Any breach of representations and warranties
(b) Any undisclosed liabilities as at the Closing Date
(c) Any pre-Closing tax liabilities

*Annotation: Cap indemnity at the subscription amount. Cap the survival period at 24–36 months post-closing. Carve out fraud from caps.*`,
      },
    ],
  },
  {
    slug: "data-bible",
    title: "Data Bible (Data Room)",
    description:
      "A complete data room checklist and template structure for Series A and beyond — covering legal, financial, commercial, and technical due diligence documents.",
    price: 199900,
    tag: "checklist",
    category: "fundraise",
    comingSoon: false,
    preview: "The full data room folder structure, document checklist (60+ items), and guidance on what to redact before sharing.",
    sections: [
      {
        heading: "Data Room Folder Structure",
        body: `**Recommended Google Drive / Notion structure:**

📁 01 — Company Overview
  - Company one-pager / executive summary
  - Pitch deck (latest version)
  - Company registration certificate
  - MOA / AOA

📁 02 — Financials
  - Audited P&L, Balance Sheet, Cash Flow (last 2–3 years)
  - Management accounts (last 12 months, monthly)
  - Financial model (3-year projections)
  - Cap table (current + post-investment)
  - Bank statements (last 3 months)

📁 03 — Legal
  - Shareholders' Agreement (existing)
  - Founders' Agreement
  - Employment agreements (key hires)
  - IP assignment agreements
  - Customer contracts (top 5)
  - Vendor agreements (material)
  - NDA register

📁 04 — Commercial
  - Customer list (with ARR, contract dates, renewal status)
  - Pipeline / CRM export
  - Churn analysis
  - Unit economics breakdown (CAC, LTV, payback)
  - Channel attribution data

📁 05 — Product & Technology
  - Product roadmap
  - Architecture overview (non-sensitive)
  - Key technology dependencies / licenses
  - Security audit report (if available)

📁 06 — Team
  - Org chart
  - Key employee profiles / LinkedIn
  - ESOP scheme document + allocation register
  - Offer letters (key hires)

📁 07 — Compliance & Regulatory
  - GST registration
  - PF & ESI registration
  - ROC filings (last 2 years)
  - FEMA approvals (if foreign investment received)
  - Any regulatory licences (fintech, healthcare, etc.)`,
      },
      {
        heading: "Due Diligence Checklist — 60 Items",
        body: `**FINANCIAL DUE DILIGENCE**
☐ Audited financial statements (3 years)
☐ Monthly MIS for last 12 months
☐ Revenue recognition policy
☐ ARR / MRR reconciliation
☐ Deferred revenue schedule
☐ Accounts receivable aging
☐ Accounts payable aging
☐ Loan / debt schedule
☐ Related-party transaction summary
☐ Tax returns (3 years) + pending tax notices
☐ GST returns (12 months)
☐ TDS filings (12 months)
☐ Bank statements (6 months, all accounts)

**LEGAL DUE DILIGENCE**
☐ Certificate of Incorporation + PAN
☐ MOA / AOA (latest)
☐ Board resolutions (material decisions, last 3 years)
☐ Shareholders' register
☐ Cap table (fully diluted)
☐ SHA / Investment agreements (all rounds)
☐ Founders' Agreement + vesting schedule
☐ All employee agreements (key team)
☐ IP assignment agreements (all founders + employees)
☐ Trademark registrations / applications
☐ Patent applications (if any)
☐ Top 5 customer contracts
☐ Material vendor agreements
☐ NDA register
☐ Any pending litigation / notices

**COMMERCIAL DUE DILIGENCE**
☐ Customer list with ARR and contract dates
☐ Top 10 customer profiles (use cases, health)
☐ Churn analysis — monthly cohort data
☐ Unit economics model (CAC, LTV, payback)
☐ Sales pipeline (current quarter)
☐ Marketing attribution breakdown
☐ Net Revenue Retention / NRR trend
☐ Pricing tiers and history

**TEAM & HR**
☐ Org chart (current + planned)
☐ ESOP scheme document
☐ ESOP allocation register
☐ Key employee offer letters
☐ Notice period / non-compete provisions for key hires
☐ Salary structure (anonymised) for investor review

**PRODUCT & TECH**
☐ Product architecture overview
☐ Tech stack list
☐ Key third-party dependencies
☐ Security / SOC2 status
☐ Uptime / SLA record
☐ Open source license review`,
      },
      {
        heading: "What to Redact Before Sharing",
        body: `**Always redact before sharing with any investor who hasn't signed an NDA:**

- Full customer names in commercial data → replace with "Customer A, B, C"
- Salary and compensation details for individuals
- Personal data of employees (Aadhaar, PAN, address)
- Login credentials, API keys, passwords — never in a data room
- Unreleased product features or roadmap details you don't want leaked to competitors

**Create tiered access:**
- Tier 1 (Exploratory): Pitch deck, one-pager, cap table summary
- Tier 2 (Post-NDA): Full financials, customer list, legal documents
- Tier 3 (Post-Term Sheet): Employee details, full contracts, bank statements

**Use Google Drive folder permissions or Notion access control — never share an entire data room link in public channels or email threads with multiple parties.**

**Before closing the round, revoke access for all investors who passed.**`,
      },
    ],
  },
  {
    slug: "financial-model-general",
    title: "Financial Model (General)",
    description:
      "A clean, investor-ready 3-year financial model template for SaaS, D2C, and services businesses — with built-in scenario analysis and a cap table model.",
    price: 249900,
    tag: "template",
    category: "fundraise",
    comingSoon: false,
    preview: "P&L, cash flow, balance sheet, cohort model, unit economics, cap table, and scenario analysis — all linked and formula-driven.",
    sections: [
      {
        heading: "Financial Model Structure & Setup",
        body: `**This model has 7 tabs:**

1. **Inputs & Assumptions** — All hardcoded numbers live here. No hard-coding anywhere else.
2. **Revenue Model** — Monthly recurring revenue, cohort churn, expansion, new ARR
3. **Cost Model** — COGS, S&M, R&D, G&A broken into line items
4. **P&L** — Profit & Loss statement (monthly, quarterly, annual)
5. **Cash Flow** — Operating, investing, financing cash flows
6. **Balance Sheet** — Summary balance sheet
7. **Cap Table** — Pre/post money, dilution tracker

---
**INPUTS TAB — KEY ASSUMPTIONS TO FILL IN:**

*Growth Assumptions:*
- New customers per month (Year 1 / Year 2 / Year 3): [X] / [X] / [X]
- Monthly churn rate: [X]%
- Expansion revenue (net of churn) from existing customers: [X]% monthly
- Average Contract Value (ACV): ₹[X]
- Sales cycle length (months): [X]

*Unit Economics:*
- CAC (blended): ₹[X]
- Gross margin: [X]%
- Payback period (target): [X] months

*Cost Assumptions:*
- Founding team salaries: ₹[X]/month
- New engineering hires: [X] in Year 1, [X] in Year 2
- Average engineering salary: ₹[X]L CTC
- Sales headcount: [X] in Year 2
- Marketing spend as % of revenue: [X]%
- Office + infrastructure: ₹[X]/month`,
      },
      {
        heading: "Revenue Model — Cohort Logic",
        body: `**MONTHLY COHORT LOGIC:**

For each month, track:
- New customers added
- Churned customers (from all prior cohorts)
- Expanded revenue from retained customers
- Net ARR at end of month

**Formula structure:**
\`ARR_t = ARR_{t-1} + New_ARR_t - Churned_ARR_t + Expansion_ARR_t\`

**Example Year 1 projection:**
| Month | New Customers | Churn | Net Customers | MRR |
|---|---|---|---|---|
| Jan | 3 | 0 | 3 | ₹1.5L |
| Feb | 4 | 0 | 7 | ₹3.5L |
| Mar | 5 | 0 | 12 | ₹6L |
| Jun | 8 | 1 | 32 | ₹16L |
| Dec | 12 | 3 | 75 | ₹37.5L |

**Key metrics to track:**
- Net Revenue Retention (NRR) = (MRR from previous cohort including expansion) / (MRR from that cohort last period)
- Target NRR for B2B SaaS: 110%+
- Gross Revenue Retention (GRR) = MRR from previous cohort excluding expansion / MRR from that cohort last period
- Target GRR: 85%+

**Rule of 40:**
At Series A, investors check: Revenue Growth Rate + EBITDA Margin ≥ 40
Example: 120% growth + (−80)% margin = 40 ✅`,
      },
      {
        heading: "Cap Table Model",
        body: `**CAP TABLE TRACKER:**

*Current State (Pre-Investment):*
| Shareholder | Shares | % Ownership |
|---|---|---|
| Founder 1 | [X] | [X]% |
| Founder 2 | [X] | [X]% |
| ESOP Pool | [X] | [X]% |
| Angel Investors | [X] | [X]% |
| **Total** | **[X]** | **100%** |

*Post-Investment (Seed Round):*
| Shareholder | Shares | % |
|---|---|---|
| Founder 1 | [X] | [X]% |
| Founder 2 | [X] | [X]% |
| ESOP Pool (expanded) | [X] | [X]% |
| Angels | [X] | [X]% |
| **New Seed Investor** | **[X]** | **[X]%** |
| **Total** | **[X]** | **100%** |

**Key cap table metrics to track:**
- Founder ownership post-seed: Should be 60%+ ideally
- ESOP pool: 10–15% pre-Series A
- Investor ownership: 15–25% per round is standard

**Dilution waterfall — example to Series B:**
- Pre-seed: Founders 80%, Angels 20%
- Post-seed (20% dilution): Founders 64%, Angels 16%, Seed 20%
- Post-Series A (20% dilution): Founders 51%, Angels 13%, Seed 16%, Series A 20%
- Post-Series B (18% dilution): Founders 42%, Angels 11%, Seed 13%, Series A 16%, Series B 18%`,
      },
    ],
  },
  {
    slug: "pitch-deck-template",
    title: "Pitch Deck Template",
    description:
      "A 12-slide pitch deck template with slide-by-slide guidance on what to include, what to avoid, and how Indian VCs read decks differently from Silicon Valley investors.",
    price: 99900,
    tag: "template",
    category: "fundraise",
    comingSoon: false,
    preview: "12-slide structure, slide-by-slide guidance, annotated examples, and India-specific investor reading patterns.",
    sections: [
      {
        heading: "Deck Structure & Slide-by-Slide Guide",
        body: `**THE 12-SLIDE STRUCTURE:**

1. **Cover** — Company name, tagline, contact. Nothing else.
2. **Problem** — One slide. The problem your customer has today, not the one you've invented.
3. **Solution** — One slide. What you do. Not how. The "what."
4. **Product** — 1–2 screenshots or a demo GIF. Show, don't tell.
5. **Market** — TAM/SAM/SOM. Bottom-up, not Statista.
6. **Traction** — Your best metric, trend line, key milestones.
7. **Business Model** — How you make money, who pays, unit economics.
8. **Go-to-Market** — How you've grown, and how you'll grow with this capital.
9. **Competition** — Competitive matrix. Be honest about who else is doing this.
10. **Team** — Names, relevant experience, why you. Not a wall of logos.
11. **Financials** — 3-year projections, current runway, use of funds.
12. **The Ask** — How much, at what valuation, what you'll achieve.

---
**SLIDE PRINCIPLES:**
- Max 30 words per slide in the body
- One idea per slide — never combine two points
- Lead with data, support with narrative
- Use consistent color scheme (2–3 colors max)
- Every slide should be able to stand alone — investors often forward individual slides`,
      },
      {
        heading: "Common Mistakes & India-Specific Notes",
        body: `**THE 5 MOST COMMON DECK MISTAKES:**

1. **Problem slide describes the solution**
❌ Wrong: "There is no single platform that manages startup fundraising"
✅ Right: "Founders spend 300 hours on average fundraising — 60% of that time on admin"

2. **Traction slide buries the lead**
❌ Wrong: Four metrics equally weighted, none prominent
✅ Right: Lead with your best metric in large type, support with 2 secondary metrics

3. **Market slide uses top-down TAM**
❌ Wrong: "The global SaaS market is $200 billion"
✅ Right: "[X] companies in India with [Y] need × ₹Z ACV = ₹XCr SAM"

4. **Team slide is a bio wall**
❌ Wrong: 4-line bio for each founder about education
✅ Right: For each founder: role, one relevant credential, one specific thing they've built/sold/achieved

5. **The ask is vague**
❌ Wrong: "We're raising ₹5–10 Cr to grow the business"
✅ Right: "₹6 Cr seed round. 18 months runway. Milestones: ₹2 Cr ARR, 3 enterprise contracts, Series A ready."

---
**INDIA-SPECIFIC NOTES:**
- Indian VCs often read decks in WhatsApp forwards and screenshot chains — design for mobile readability
- Regulatory landscape slide is valued for fintech, healthcare, edtech — add it if relevant
- India-focused market size is more credible than global numbers — show you understand the local dynamics
- References to prior Indian startup exits in your space build credibility — include them in the competition slide
- Founder pedigree (IIT/IIM, prior startup, corporate experience) carries more weight in Indian VC than in the US — lead with it`,
      },
    ],
  },
  {
    slug: "nda-fundraise",
    title: "Non-Disclosure Agreement (Fundraise)",
    description:
      "A mutual NDA template designed for sharing confidential information with potential investors during fundraising — clean, enforceable, and founder-balanced.",
    price: 49900,
    tag: "legal",
    category: "fundraise",
    comingSoon: false,
    preview: "Mutual NDA template with fundraise-specific carve-outs, practical guidance on when to use it, and a one-page simplified version.",
    sections: [
      {
        heading: "Mutual NDA Template — Full Version",
        body: `**MUTUAL NON-DISCLOSURE AGREEMENT**

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of [DATE] between:

1. **[COMPANY NAME]**, a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] ("Company"); and
2. **[INVESTOR / RECIPIENT NAME]**, [having its registered office at / residing at] [ADDRESS] ("Recipient")

(each a "Party" and together the "Parties")

---
**1. PURPOSE**
The Parties wish to explore a potential investment relationship ("Permitted Purpose") and may share confidential information with each other for this purpose.

**2. DEFINITION OF CONFIDENTIAL INFORMATION**
"Confidential Information" means any information, technical data, trade secrets, know-how, business plans, financial information, customer data, or other information disclosed by one Party to the other in connection with the Permitted Purpose, whether in written, oral, digital, or any other form, and whether or not marked "confidential."

Confidential Information does not include information that:
(a) is or becomes publicly known through no breach of this Agreement;
(b) was known to the Recipient before disclosure, as evidenced by written records;
(c) is independently developed by the Recipient without use of Confidential Information;
(d) is lawfully received from a third party without restriction.

**3. OBLIGATIONS**
Each Party agrees to:
(a) Hold the other Party's Confidential Information in strict confidence;
(b) Not disclose it to any third party without prior written consent;
(c) Use it solely for the Permitted Purpose;
(d) Limit access to its employees, advisors, and agents with a need to know, who are bound by equivalent confidentiality obligations.

**4. DURATION**
This Agreement shall remain in effect for [2] years from the date of execution. The confidentiality obligations shall survive for [3] years after termination.

**5. RETURN OF INFORMATION**
Upon request, each Party shall promptly return or destroy all Confidential Information received.

**6. NO LICENSE**
Nothing in this Agreement grants any license to use any Confidential Information except as expressly set forth herein.

**7. GOVERNING LAW**
This Agreement shall be governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts in [CITY].

---
*IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.*

[COMPANY SIGNATURE BLOCK]
[INVESTOR SIGNATURE BLOCK]`,
      },
      {
        heading: "When to Use an NDA (and When Not To)",
        body: `**USE AN NDA BEFORE SHARING:**
- Full financial statements (P&L, balance sheet, bank statements)
- Customer names, contract values, and retention data
- Technical architecture and source code
- Unreleased product roadmap
- Internal pricing or margin data
- Details of pending regulatory applications

**DON'T REQUIRE AN NDA FOR:**
- Your pitch deck — investors see 10–20 decks per week. Requiring an NDA for a deck signals you're inexperienced and will significantly reduce the number who engage with you
- Your high-level one-pager or executive summary
- General product overview without technical specifics

**PRACTICAL REALITY:**
- Most institutional VCs in India will not sign NDAs at the pitch stage — this is standard practice globally, not a red flag
- Angels and family offices are more willing to sign
- For serious investors who've expressed term sheet interest, an NDA for data room access is standard and expected

**DIGITAL-FIRST APPROACH:**
Instead of a paper NDA for data room access, use Google Drive / Notion access control with a click-to-accept NDA embedded in the sharing flow. Services like DocuSign + Notion can automate this.`,
      },
    ],
  },

  // ─── STARTUP — LEGAL & BUSINESS DOCS ────────────────────────────────────────
  {
    slug: "kmp-agreement",
    title: "KMP Agreement",
    description:
      "A Key Managerial Personnel agreement template covering appointment terms, responsibilities, remuneration, confidentiality, and IP assignment for CXO-level hires.",
    price: 199900,
    tag: "legal",
    category: "startup",
    comingSoon: false,
    preview: "Full KMP agreement template with CEO, CFO, and CTO variants, ESOP vesting clause, and non-compete provisions.",
    sections: [
      {
        heading: "KMP Agreement Template",
        body: `**KEY MANAGERIAL PERSONNEL AGREEMENT**

This Agreement is entered into on [DATE] between:

1. **[COMPANY NAME]**, a Private Limited Company (CIN: [CIN]) ("Company"); and
2. **[KMP NAME]**, residing at [ADDRESS] ("KMP")

---
**1. APPOINTMENT**
The Company hereby appoints the KMP as [Chief Executive Officer / Chief Financial Officer / Chief Technology Officer / Company Secretary] with effect from [DATE].

**2. TERM**
This appointment is for an initial period of [3] years, renewable by mutual consent. Either party may terminate with [90] days' written notice (or immediate termination for cause).

**3. REMUNERATION**
3.1 Fixed Compensation: ₹[X] per annum (CTC), paid monthly
3.2 Variable Pay: Up to [X]% of fixed compensation, tied to KPIs defined in Schedule 1
3.3 ESOPs: [X] options under the Company ESOP scheme, vesting over 4 years with a 1-year cliff
3.4 Allowances: [HRA, Transport, Medical as per Schedule 2]
3.5 Perquisites: [Company car / fuel / mobile reimbursement as applicable]

**4. RESPONSIBILITIES**
The KMP shall be responsible for:
[For CEO:]
(a) Overall management and strategic direction of the Company
(b) Implementation of Board decisions and policies
(c) Representation of the Company to investors, regulators, and key stakeholders
(d) Financial oversight, fundraising, and investor relations
(e) Hiring and performance management of the leadership team

[For CFO:]
(a) Financial planning, budgeting, and reporting
(b) Investor relations and fundraising support
(c) Regulatory compliance (ROC, SEBI, FEMA)
(d) Treasury management and risk oversight

[For CTO:]
(a) Technology vision, architecture, and roadmap
(b) Engineering team management and hiring
(c) Product-technology alignment with business objectives
(d) Security, scalability, and platform reliability`,
      },
      {
        heading: "Non-Compete, Confidentiality & IP Clauses",
        body: `**5. CONFIDENTIALITY**
The KMP agrees to:
(a) Keep all Confidential Information of the Company strictly confidential during and for [3] years after termination
(b) Not disclose any Confidential Information to any third party without prior written approval of the Board
(c) Return all Company data, devices, and documents on termination

**6. INTELLECTUAL PROPERTY**
6.1 All work product, inventions, software, designs, and innovations created by the KMP in the course of employment belong exclusively to the Company.
6.2 The KMP hereby irrevocably assigns all such IP to the Company.
6.3 The KMP shall execute any additional documents reasonably required to perfect such assignment.
6.4 Prior IP: The KMP discloses all prior inventions and IP in Schedule 3. The Company waives any claim to such prior IP.

**7. NON-SOLICITATION**
During employment and for [12] months post-termination, the KMP shall not:
(a) Solicit, induce, or recruit any employee, contractor, or advisor of the Company
(b) Solicit, approach, or accept business from any customer or prospect of the Company with whom the KMP had material contact during employment

**8. NON-COMPETE**
For a period of [6–12] months post-termination, the KMP shall not engage in, or be employed by, any business that directly competes with the Company in [India / specified geography].

*Note: Non-compete enforceability in India is limited under the Indian Contract Act — courts generally only enforce it during the period of employment. Post-employment non-compete must be reasonable in scope, geography, and duration.*

**9. TERMINATION FOR CAUSE**
The Company may terminate this Agreement immediately without notice or compensation in the event of:
(a) Fraud, dishonesty, or breach of fiduciary duty
(b) Material breach of this Agreement
(c) Conviction for any criminal offence
(d) Wilful neglect of duty
(e) Conflict of interest not disclosed to the Board`,
      },
    ],
  },
  {
    slug: "employee-agreement",
    title: "Employee Agreement",
    description:
      "A comprehensive employment agreement template for full-time hires — covering appointment, compensation, IP assignment, confidentiality, and exit provisions.",
    price: 149900,
    tag: "legal",
    category: "startup",
    comingSoon: false,
    preview: "Full employment agreement with IP assignment, non-solicitation, ESOP clause, and a plain-language summary of each key provision.",
    sections: [
      {
        heading: "Employment Agreement Template",
        body: `**EMPLOYMENT AGREEMENT**

This Agreement is made on [DATE] between:

1. **[COMPANY NAME]** ("Company"); and
2. **[EMPLOYEE NAME]** ("Employee")

---
**1. POSITION & COMMENCEMENT**
Position: [JOB TITLE]
Department: [DEPARTMENT]
Reporting to: [MANAGER TITLE]
Start date: [DATE]
Work location: [CITY / Remote / Hybrid]

**2. PROBATION**
The Employee shall be on probation for [90] days. During this period, either party may terminate with [7] days' written notice. On successful completion, employment becomes confirmed.

**3. COMPENSATION**
3.1 Fixed CTC: ₹[X] per annum
3.2 Breakdown: ₹[X] Basic + ₹[X] HRA + ₹[X] Special Allowance + ₹[X] PF (employer) + ₹[X] Gratuity provision
3.3 Variable: [X]% of fixed CTC, payable annually, subject to performance
3.4 ESOP (if applicable): [X] options, as per the Company ESOP Policy

**4. WORKING HOURS & LEAVE**
4.1 Standard working hours: [Monday–Friday, 9am–6pm] or as required by the role
4.2 Annual leave: [18] days per year
4.3 Sick leave: [12] days per year
4.4 Public holidays: As per company holiday list

**5. NOTICE PERIOD**
5.1 During probation: [7] days
5.2 Post-confirmation: [30/60/90] days
5.3 The Company reserves the right to pay in lieu of notice

**6. INTELLECTUAL PROPERTY ASSIGNMENT**
All work product, software, inventions, or designs created by the Employee:
(a) in the course of employment; or
(b) using Company resources; or
(c) related to the Company's business
shall be the sole property of the Company, and the Employee hereby assigns all rights therein.`,
      },
      {
        heading: "Key Provisions — Annotated",
        body: `**CONFIDENTIALITY**
The Employee shall not disclose any Confidential Information during employment or for [2] years thereafter.

*Annotation: Include a broad definition of confidential information — customer data, financials, product plans, trade secrets. Ensure the clause survives termination.*

**NON-SOLICITATION**
For [12] months post-termination, the Employee shall not:
(a) Recruit or solicit any Company employee
(b) Solicit any customer or prospect the Employee dealt with in the last 12 months of employment

*Annotation: This is generally enforceable in India, unlike blanket non-competes. Keep it targeted — broad non-solicit clauses are challenged in court.*

**BACKGROUND VERIFICATION**
This offer is subject to satisfactory background verification, including:
- Previous employment verification
- Educational qualification verification
- Criminal record check (if applicable to the role)

*Annotation: Retain the right to revoke the offer or terminate if background check reveals material discrepancies.*

**MOONLIGHTING POLICY**
The Employee shall not undertake any other employment, consulting, or advisory role without prior written approval from the Company.

*Include carve-out for personal investments and pre-disclosed existing advisory roles.*

**SOCIAL MEDIA POLICY**
The Employee shall not make public statements about the Company, its products, investors, or employees without prior approval, in any medium including social media.

**GOVERNING LAW**
This Agreement shall be governed by Indian law and all disputes shall be subject to the jurisdiction of courts in [CITY].`,
      },
    ],
  },
  {
    slug: "gtm-plan",
    title: "GTM Plan",
    description:
      "A go-to-market plan template for B2B and B2C startups — covering ICP definition, channel strategy, launch sequencing, and a 90-day execution calendar.",
    price: 99900,
    tag: "playbook",
    category: "startup",
    comingSoon: false,
    preview: "ICP definition framework, channel strategy matrix, 90-day GTM calendar, and launch checklist.",
    sections: [
      {
        heading: "ICP Definition & Channel Strategy",
        body: `**STEP 1: DEFINE YOUR IDEAL CUSTOMER PROFILE (ICP)**

Don't start channel strategy without this. Your ICP determines everything.

**ICP framework for B2B:**
- Company size: [X–X employees / ₹XCr–₹XCr revenue]
- Industry: [Primary / Secondary]
- Geography: [Tier 1 / Tier 2 / Specific cities]
- Role of buyer: [Job title, seniority level]
- Role of user: [Often different from buyer]
- Trigger event: What just happened that makes them ready to buy? (e.g., new funding, new hire, regulatory deadline)
- Budget authority: Who signs off? What's the typical budget cycle?
- Key pain: The specific problem they're experiencing right now
- Alternative they're using: What do they do today without you?

**ICP framework for B2C:**
- Demographics: Age, income bracket, location
- Psychographics: Values, lifestyle, identity
- Behaviour trigger: What triggers the purchase decision?
- Channel where they spend time
- Price sensitivity
- Buying frequency

---
**STEP 2: CHANNEL STRATEGY MATRIX**

For each potential channel, score on: Reach, Cost, Conversion, Time-to-Results

| Channel | Reach | CAC (est.) | Conv. Rate | Time to results | Priority |
|---|---|---|---|---|---|
| Outbound sales | Medium | ₹[X] | [X]% | 30–60 days | High |
| Content / SEO | High | ₹[X] | [X]% | 90–180 days | Medium |
| Paid ads | High | ₹[X] | [X]% | 7–30 days | Medium |
| Referrals | Low | ₹[X] | [X]% | Variable | High |
| Partnerships | Medium | ₹[X] | [X]% | 60–90 days | Low |
| Community | Medium | ₹[X] | [X]% | 60–90 days | Medium |`,
      },
      {
        heading: "90-Day GTM Calendar Template",
        body: `**MONTH 1 — FOUNDATION (Days 1–30)**

Week 1–2:
☐ Finalise ICP (primary and secondary)
☐ Build list of 100 target accounts (B2B) or user profiles (B2C)
☐ Set up CRM / outreach tracking
☐ Prepare core messaging: 1 elevator pitch, 3 value propositions, 5 objection responses
☐ Create minimum viable sales collateral: 1-pager, deck, case study (even if it's just a use case)

Week 3–4:
☐ Begin outbound: 20 personalised outreach attempts per day
☐ Set up basic analytics (Mixpanel / GA / Amplitude)
☐ Define North Star metric and dashboard
☐ Run 10 discovery calls with prospects
☐ Document objections and adjust messaging

---
**MONTH 2 — TRACTION (Days 31–60)**

Week 5–6:
☐ Double down on the 1–2 channels showing signal
☐ First 3–5 paying customers (B2B) or 50–100 DAU (B2C)
☐ Build referral loop: ask every customer for 1 intro
☐ Create first content asset based on ICP pain

Week 7–8:
☐ A/B test messaging: 3 variants of your core value prop
☐ CAC/LTV calculation — first data points
☐ Build case study from first customer
☐ Define renewal / retention play

---
**MONTH 3 — SCALE (Days 61–90)**

Week 9–10:
☐ Launch second acquisition channel
☐ First paid campaign (if metrics support it)
☐ Formalize referral program

Week 11–12:
☐ Review unit economics: CAC, LTV, payback period
☐ Double down on what worked; kill what didn't
☐ Prepare GTM retrospective for team + investors`,
      },
    ],
  },
  {
    slug: "startup-idea-analysis",
    title: "Startup Idea Analysis",
    description:
      "A structured framework for analysing a startup idea before committing to it — covering problem validation, market sizing, competitive moat, and founder-market fit.",
    price: 79900,
    tag: "framework",
    category: "startup",
    comingSoon: false,
    preview: "7-dimension idea scoring framework, problem validation interview guide, and a go/no-go decision matrix.",
    sections: [
      {
        heading: "7-Dimension Idea Scoring Framework",
        body: `Rate each dimension 1–5. Ideas scoring ≥ 3.5 average with no dimension below 2 are worth exploring.

**1. Problem Severity (1–5)**
How painful is this problem, really?
1 = Nice to have
3 = Causes regular friction
5 = Causes significant loss of money / time / wellbeing; people are actively seeking solutions

**2. Market Size (1–5)**
How big is the addressable market?
1 = < ₹100 Cr TAM
3 = ₹500 Cr–₹1,000 Cr TAM
5 = > ₹5,000 Cr TAM with clear path to capture

**3. Founder-Market Fit (1–5)**
Why are you specifically the right person to build this?
1 = No relevant experience or connection to the problem
3 = Adjacent domain experience
5 = Deep domain expertise, existing relationships, or unique insight others don't have

**4. Competitive Moat (1–5)**
How defensible is this over time?
1 = Anyone can copy it in 3 months
3 = Network effects, switching costs, or data advantage emerging
5 = Clear structural moat (regulatory, tech, network, exclusive distribution)

**5. Business Model Clarity (1–5)**
How clear is the path to revenue?
1 = No idea who pays or how much
3 = Clear customer and pricing, unproven willingness to pay
5 = Paying customers exist; unit economics are clear

**6. Timing (1–5)**
Why is now the right moment?
1 = This could have been built 5 years ago
3 = Market is growing; no specific tailwind
5 = Specific regulatory, behavioral, or technological shift just happened

**7. Distribution Advantage (1–5)**
Do you have an unfair distribution advantage?
1 = You'll need to build from scratch like everyone else
3 = Some warm channels or partnerships
5 = You have existing distribution (audience, platform access, enterprise relationships)`,
      },
      {
        heading: "Problem Validation Interview Guide",
        body: `**Run 20 customer interviews before writing a line of code.**

**WHO TO INTERVIEW:**
Your hypothetical ICP. If you don't have access, ask for introductions. If you can't get 20 interviews, you don't have the distribution to build the company.

**BEFORE THE INTERVIEW:**
- Don't pitch. You're here to learn, not sell.
- Take notes or ask permission to record.
- Have your hypothesis written down so you can test it.

**INTERVIEW SCRIPT (30 minutes):**

Opening:
"I'm researching [problem space]. I want to understand how people like you currently [do the thing]. I'm not selling anything — I'd love to learn from your experience."

Discovery questions:
1. "Can you walk me through the last time you had to [do the thing related to your problem]? What happened?"
2. "What was the hardest part of that?"
3. "How often does this come up?"
4. "What have you tried to solve it? What worked? What didn't?"
5. "How much time / money / frustration does this cause you?"
6. "If you could fix one thing about this process, what would it be?"
7. "Who else in your organisation / life is affected by this?"

Optional (to gauge urgency):
"If I told you I had a solution to [the specific pain they mentioned], how quickly would you want to see it?"

**After 20 interviews, ask:**
- Did at least 15/20 confirm the same core pain?
- Did anyone have a workaround that partially solves it? (= problem is real)
- Did anyone offer to pay you before you've built anything? (= strongest signal)`,
      },
    ],
  },
  {
    slug: "market-positioning",
    title: "Market Positioning",
    description:
      "A positioning framework for early-stage startups — covering category creation, competitive positioning, and how to write a positioning statement that sticks.",
    price: 99900,
    tag: "framework",
    category: "startup",
    comingSoon: false,
    preview: "April Dunford's positioning framework adapted for Indian startups, with before/after examples and a competitive positioning map template.",
    sections: [
      {
        heading: "Positioning Framework",
        body: `**THE 5 COMPONENTS OF POSITIONING (adapted from April Dunford):**

1. **Competitive Alternatives** — What do customers do if your product doesn't exist?
   Not your direct competitors. The status quo. Spreadsheets. WhatsApp. Doing nothing.
   *Your product competes against the alternative, not just other startups.*

2. **Unique Attributes** — What do you have that alternatives don't?
   Features, data, integrations, team, relationships, speed.
   Be specific. "Better UX" is not an attribute.

3. **Value** — What does each attribute enable for the customer?
   Translate each attribute into a concrete business outcome.
   Attribute: "Real-time bank data" → Value: "Finance team closes books in 2 days, not 10"

4. **Customer Segments** — Who cares most about that value?
   Not everyone. The specific segment where your value is most valuable.

5. **Market Category** — What are you?
   The frame the customer uses to understand what you do and who you compete with.
   You choose this. Choose carefully — the category determines what you're compared to.

---
**POSITIONING STATEMENT TEMPLATE:**
For [Target Customer] who [have this need / problem], [Company] is a [market category] that [key benefit]. Unlike [competitive alternatives], we [key differentiator].

**Example:**
For D2C brands doing ₹1–10 Cr monthly revenue who struggle with reconciling payments across Razorpay, Shopify, and bank accounts, Finly is a financial operations platform that automates reconciliation in real-time. Unlike manual spreadsheets or generic accounting software, Finly is built for D2C payment complexity.`,
      },
    ],
  },
  {
    slug: "value-proposition",
    title: "Value Proposition",
    description:
      "A value proposition design workbook — from customer jobs-to-be-done to a crisp one-liner that converts, with templates for B2B and B2C contexts.",
    price: 79900,
    tag: "framework",
    category: "startup",
    comingSoon: false,
    preview: "Jobs-to-be-done canvas, gain/pain mapping, value proposition canvas, and a formula for writing a one-liner that resonates.",
    sections: [
      {
        heading: "Jobs-to-Be-Done & Value Proposition Canvas",
        body: `**CUSTOMER PROFILE — JOBS TO BE DONE:**

For your target customer, identify three types of jobs:

1. **Functional Jobs** — Practical tasks they're trying to accomplish
   Example: "Manage my team's expense claims without chasing receipts"

2. **Social Jobs** — How they want to be perceived by others
   Example: "Be seen as a financially rigorous founder who investors trust"

3. **Emotional Jobs** — How they want to feel
   Example: "Feel in control of my company's finances, not anxious about month-end"

---
**GAIN/PAIN MAP:**

*Customer Pains (ranked by severity):*
1. [Most severe pain — causes significant loss or frustration]
2. [Moderate pain — regular friction]
3. [Minor pain — inconvenience]

*Customer Gains (ranked by importance):*
1. [Most desired outcome]
2. [Expected outcome]
3. [Unexpected delight]

---
**VALUE PROPOSITION CANVAS:**

*Pain Relievers:* How your product reduces or eliminates the customer's pains
- Pain 1 → [How you relieve it]
- Pain 2 → [How you relieve it]

*Gain Creators:* How your product creates the customer's desired gains
- Gain 1 → [How you create it]
- Gain 2 → [How you create it]

*Products & Services:* What specifically delivers the value
- [Feature / product component]
- [Feature / product component]

---
**ONE-LINER FORMULA:**
We help [WHO] [DO WHAT] [DIFFERENT FROM ALTERNATIVES] [SO THAT OUTCOME].

Example: "We help D2C founders reconcile payments 80% faster than spreadsheets, so they can close books in 2 days instead of 10."`,
      },
    ],
  },
  {
    slug: "employee-offer-letter",
    title: "Employee Offer Letter Template",
    description:
      "A clean, professional offer letter template for full-time hires — with ESOP clause variant, joining bonus variant, and guidance on offer letter best practices.",
    price: 49900,
    tag: "legal",
    category: "startup",
    comingSoon: false,
    preview: "Standard offer letter + ESOP variant + joining bonus variant, with notes on offer letter etiquette and how to handle counter-offers.",
    sections: [
      {
        heading: "Standard Offer Letter Template",
        body: `**[COMPANY LETTERHEAD]**

[DATE]

Dear [CANDIDATE NAME],

We are pleased to offer you the position of **[JOB TITLE]** at [COMPANY NAME], based in [LOCATION], effective [START DATE].

---
**COMPENSATION PACKAGE:**

| Component | Annual (₹) |
|---|---|
| Basic Salary | [X] |
| House Rent Allowance | [X] |
| Special Allowance | [X] |
| Provident Fund (Employer) | [X] |
| Gratuity Provision | [X] |
| **Total CTC** | **[X]** |

Variable Pay: You are eligible for a performance-linked variable pay of up to ₹[X] per annum, assessed annually.

---
**BENEFITS:**
- Health insurance: ₹[X] per annum (self + spouse + 2 children)
- [Mobile reimbursement: ₹[X] per month]
- [Fuel/Transport: ₹[X] per month]
- [Laptop provided / BYOD allowance: ₹[X]]

**LEAVE:**
- Annual leave: [18] days
- Sick leave: [12] days
- Public holidays: as per company calendar

**PROBATION:** [90] days. Notice during probation: [7] days.

**NOTICE PERIOD (post-confirmation):** [60] days.

---
This offer is conditional upon:
(a) Satisfactory background verification
(b) Submission of relieving letter from previous employer
(c) Execution of the Employment Agreement

Please confirm your acceptance by [DATE] by signing and returning this letter.

We look forward to having you on the team.

Warm regards,

[FOUNDER NAME]
[DESIGNATION]
[COMPANY NAME]

---
*I accept the offer as detailed above.*
Signature: ________________
Date: ________________`,
      },
    ],
  },
  {
    slug: "founders-agreement",
    title: "Founders Agreement",
    description:
      "A comprehensive founders' agreement template covering equity split, vesting, roles, decision-making, IP assignment, and exit provisions — the most important document you'll sign before your first investor.",
    price: 249900,
    tag: "legal",
    category: "startup",
    comingSoon: false,
    preview: "Full founders' agreement with equity split framework, vesting schedule, dispute resolution, and a pre-discussion checklist for co-founders.",
    sections: [
      {
        heading: "Founders Agreement Template",
        body: `**FOUNDERS' AGREEMENT**

This Agreement is entered into on [DATE] between:

1. [FOUNDER 1 NAME], residing at [ADDRESS] ("Founder 1")
2. [FOUNDER 2 NAME], residing at [ADDRESS] ("Founder 2")
[3. [FOUNDER 3 NAME] ("Founder 3")] — if applicable

(collectively, the "Founders")

for and on behalf of **[COMPANY NAME]** (to be incorporated or recently incorporated)

---
**ARTICLE 1 — EQUITY SPLIT**

1.1 The Founders agree to the following initial equity allocation:
| Founder | Initial % | Role |
|---|---|---|
| Founder 1 | [X]% | CEO |
| Founder 2 | [X]% | CTO |
| [Founder 3] | [X]% | [Role] |
| **ESOP Pool** | **[X]%** | — |
| **Total** | **100%** | |

1.2 This allocation is subject to the vesting schedule set out in Article 2.

1.3 The Founders acknowledge that this split reflects contributions to date (idea, initial capital, technical IP, customer relationships) as documented in Schedule 1.

**ARTICLE 2 — VESTING**

2.1 All Founder shares shall vest over 4 years with a 1-year cliff from the Incorporation Date.
2.2 Cliff: 25% of allocated shares vest on the first anniversary of the Incorporation Date.
2.3 Monthly vest: The remaining 75% vest equally over the following 36 months.
2.4 Acceleration: Upon an Exit Event, [50% / 100%] of unvested shares shall accelerate.

**ARTICLE 3 — ROLES & DECISION-MAKING**

3.1 Roles:
- Founder 1 shall serve as CEO, responsible for [commercial, fundraising, and company strategy]
- Founder 2 shall serve as CTO, responsible for [product, engineering, and technology]

3.2 Day-to-day decisions (< ₹[X]): any Founder acting alone
3.3 Material decisions (₹[X] – ₹[X], new hires above ₹[X] CTC): majority Founder approval
3.4 Reserved decisions (equity issuance, exit, change of business): unanimous Founder approval`,
      },
      {
        heading: "IP Assignment, Exit Provisions & Pre-Discussion Checklist",
        body: `**ARTICLE 4 — IP ASSIGNMENT**
All intellectual property, code, designs, trade secrets, and inventions created by any Founder — whether before or after incorporation, and related to the Company's business — are hereby assigned to the Company.

The Founders agree to execute any additional documents required to perfect this assignment.

**ARTICLE 5 — CONFIDENTIALITY**
During the term and for [3] years after any Founder's departure, all Founders agree to maintain strict confidentiality of Company information.

**ARTICLE 6 — LEAVER PROVISIONS**

6.1 Good Leaver: Departure due to death, disability, or termination without cause.
- Unvested shares are bought back at Fair Market Value (determined by independent valuation)
- Vested shares retained in full

6.2 Bad Leaver: Voluntary resignation or termination for cause within [3] years.
- Unvested shares are bought back at face value (₹10 per share)
- Vested shares retained, but subject to ROFR at fair market value

**ARTICLE 7 — DISPUTE RESOLUTION**
7.1 Founders commit to attempt good-faith resolution within [30] days of any dispute.
7.2 If unresolved, disputes shall be referred to mediation before arbitration.
7.3 Arbitration shall be conducted under the Arbitration and Conciliation Act, 1996, in [CITY].

---
**PRE-AGREEMENT DISCUSSION CHECKLIST:**

Before signing, every founding team should explicitly discuss and agree on:

☐ What happens if a founder wants to leave in Year 1?
☐ What is the trigger for a "bad leaver" classification?
☐ Who has final say if co-founders disagree on a major product decision?
☐ What is each founder's financial runway? (Affects how long they can go without salary)
☐ What is the minimum salary each founder needs to sustain themselves?
☐ Are there any existing commitments (other jobs, advisory roles, equity in other companies) that need to be disclosed?
☐ What's the vision for the company — lifestyle business or venture-scale?
☐ Under what conditions would you be open to selling the company?`,
      },
    ],
  },
  {
    slug: "nda-startup",
    title: "Non-Disclosure Agreement (Startup Operations)",
    description:
      "NDA templates for startup operations — covering employee NDA, vendor/contractor NDA, and customer NDA, with guidance on when to use each.",
    price: 49900,
    tag: "legal",
    category: "startup",
    comingSoon: false,
    preview: "Three NDA variants (employee, vendor, customer) with usage guidance and a standard confidentiality clause for embedding in other agreements.",
    sections: [
      {
        heading: "Employee & Contractor NDA",
        body: `**CONFIDENTIALITY AGREEMENT (EMPLOYEE / CONTRACTOR)**

This Agreement is entered into between **[COMPANY NAME]** and **[NAME]** ("Recipient").

---
**1. CONFIDENTIAL INFORMATION**
"Confidential Information" includes: source code, product roadmap, financial data, customer lists, pricing, business strategies, and any information marked as confidential or reasonably understood to be confidential.

**2. OBLIGATIONS**
The Recipient shall:
(a) Keep all Confidential Information strictly confidential
(b) Not disclose it to any third party
(c) Use it solely for the purpose of performing services for the Company
(d) Return or destroy it upon request or termination

**3. EXCEPTIONS**
Obligations do not apply to information that is: (a) publicly known, (b) independently developed, (c) received from a third party without restriction, or (d) required to be disclosed by law.

**4. TERM**
During engagement and for [2] years thereafter.

**5. REMEDIES**
The Recipient acknowledges that breach would cause irreparable harm, and the Company is entitled to seek injunctive relief without bond.

---
**VENDOR / CONTRACTOR NDA**
Same structure as above, with added clause:

The Contractor shall not subcontract any work or share Confidential Information with subcontractors without prior written approval.

---
**CUSTOMER NDA (One-Way)**
Used when sharing early product information or roadmap with key enterprise customers before a signed contract.

Same structure, but one-way: Company's obligations are limited to reasonable care, not strict confidentiality (customers share less sensitive information).`,
      },
    ],
  },
]

export function getTemplatesByCategory(category: "fundraise" | "startup") {
  return templates.filter((t) => t.category === category)
}

export function getTemplate(slug: string) {
  return templates.find((t) => t.slug === slug)
}
