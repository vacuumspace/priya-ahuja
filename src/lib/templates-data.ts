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
]

export function getTemplatesByCategory(category: "fundraise" | "startup") {
  return templates.filter((t) => t.category === category)
}

export function getTemplate(slug: string) {
  return templates.find((t) => t.slug === slug)
}
