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
    price: 19900,
    tag: "templates",
    category: "fundraise",
    comingSoon: false,
    preview:
      "7 battle-tested cold emails, 3 follow-up sequences, and 4 LinkedIn connection messages - each with notes on why they work.",
    sections: [
      {
        heading: "Cold Email #1 - The Warm Intro Ask",
        body: `**Subject:** Quick intro request - [Mutual contact] suggested I reach out

Hi [Investor first name],

[Mutual contact] mentioned you've backed a few companies in [space] and thought there might be a fit with what we're building.

I'm [Name], co-founder of [Company]. We [one-line what you do] - we've gone from 0 to [metric] in [timeframe] with no outside capital.

Would you be open to a 20-minute call this week or next?

[Your name]

---
**Why it works:** The mutual contact creates instant trust. The metric does the heavy lifting - no pitch, no ask for money, just proof of traction. Keeping it under 80 words forces you to only include what matters.`,
      },
      {
        heading: "Cold Email #2 - The Traction Lede",
        body: `**Subject:** [Company] - ₹[X]L MRR, raising seed

Hi [Investor first name],

We crossed ₹[X]L MRR last month. We're raising a ₹[X]Cr seed round and keeping the round tight - 3–4 investors max.

[Company] is [one-line description]. Our customers are [who], paying [ARPU], with [retention stat].

I've been following your investments in [portfolio company] and [portfolio company] - I think there's a clear thesis match.

Happy to send the deck or hop on a call.

[Your name]

---
**Why it works:** Traction in the subject line filters for investors who care about the stage you're at. Leading with revenue signals you don't need permission to exist. The small round size creates scarcity.`,
      },
      {
        heading: "Cold Email #3 - The Insight Email",
        body: `**Subject:** Something I noticed about [their portfolio company's space]

Hi [Investor first name],

I've been watching [portfolio company] and [competitor] for the last year - there's a pattern in how [specific insight about the market].

We're building [Company] because of exactly this. [2 sentences on what you do differently].

We just closed [X customers / ₹XL ARR / X% month-on-month growth]. Raising a ₹[X]Cr seed - would love 20 minutes.

[Your name]

---
**Why it works:** This positions you as a peer, not a supplicant. Investors who've backed a company in your space want to know what's changed. The insight demonstrates you're thinking at a strategic level, not just selling.`,
      },
      {
        heading: "Cold Email #4 - The Direct Ask",
        body: `**Subject:** Seed round - [Company], [space]

[Investor first name],

[Company] - [one-liner].

Numbers:
- ₹[X]L MRR / [X] paying customers
- [X]% MoM growth, [X] months straight
- CAC ₹[X], LTV ₹[X]

Raising ₹[X]Cr. [X]% allocated. Looking for [X] more investors.

Deck: [link]

Worth a call?

[Your name]

---
**Why it works:** Some investors prefer pure signal. No story, no flattery - just numbers. Use this for investors who've explicitly said they want concise outreach, or for second-tier targets where you don't have a warm intro.`,
      },
      {
        heading: "Cold Email #5 - The Portfolio Angle",
        body: `**Subject:** Saw your investment in [portfolio co] - building the next layer

Hi [Investor first name],

Your bet on [portfolio company] was early and right. We're building [Company] - [one-line] - which sits directly on top of / complements / is the enterprise version of what they built.

[Portfolio company] solved [X problem]. We're solving [Y problem] for [Z customer segment], which [portfolio company] deliberately left on the table.

We're at ₹[X]L ARR and raising ₹[X]Cr. Happy to share the deck.

[Your name]

---
**Why it works:** References something the investor already believes in. Framing yourself as additive (not competitive) to a portfolio company is smart - it signals you've done your homework and there's no portfolio conflict.`,
      },
      {
        heading: "Cold Email #6 - Post-Event Reconnect",
        body: `**Subject:** Good meeting you at [event]

Hi [Investor first name],

Enjoyed our 5 minutes at [event] - you mentioned [specific thing they said].

To follow up properly: [Company] is [one-liner]. We've hit [key traction metric] and are raising ₹[X]Cr.

Here's the deck: [link]. Would you be open to a proper conversation?

[Your name]

---
**Why it works:** References a real human moment. Most founders send generic follow-ups - this one proves you were actually listening. The deck link respects their time.`,
      },
      {
        heading: "Cold Email #7 - The Re-Engage",
        body: `**Subject:** [Company] - update since we last spoke

Hi [Investor first name],

We spoke [X months ago] - you passed because [thing you remember they said, e.g. "the market felt early"].

Since then:
- [Milestone 1]
- [Milestone 2]
- [Milestone 3]

The market has moved. I'd love to revisit if you have 20 minutes.

[Your name]

---
**Why it works:** Investors who passed once are warm leads. They already know your story. Showing you remembered why they passed - and that you've addressed it - is one of the highest-conversion outreach moves. Keep the update list tight: 3 bullets max.`,
      },
      {
        heading: "Follow-Up Sequence #1 - Standard 3-Email Sequence",
        body: `**Email 1 (Day 0):** Your cold email (use any of the 7 above).

**Email 2 (Day 5):**
Subject: Re: [original subject]

Hi [name], bumping this up in case it got buried.

Happy to send a 2-pager if a full deck feels like too much right now.

[Your name]

---
**Email 3 (Day 12):**
Subject: Re: [original subject]

Last nudge - I know inboxes are brutal.

If the timing isn't right or it's not a fit, totally fine. Just let me know and I'll stop following up.

[Your name]

---
**Why it works:** Three emails is the maximum before you damage the relationship. The second email offers a lower-commitment option (2-pager). The third email gives them an easy out - which paradoxically gets more replies than a hard push.`,
      },
      {
        heading: "Follow-Up Sequence #2 - The Value Add",
        body: `**Email 1 (Day 0):** Your cold email.

**Email 2 (Day 6):**
Subject: Something you might find useful - Re: [Company]

Hi [name],

Following up, and also wanted to share something: [link to article / data point / insight that's genuinely relevant to their portfolio or thesis].

Thought of you when I read this because [specific reason].

Still happy to connect on [Company] when the timing works.

[Your name]

---
**Why it works:** Adds value before the ask. Positions you as someone worth knowing, not just another founder in the queue. Only works if the content you share is actually good and relevant - don't be generic.`,
      },
      {
        heading: "Follow-Up Sequence #3 - The Traction Update",
        body: `**Email 1 (Day 0):** Your cold email.

**Email 2 (Day 7):**
Subject: Quick update - Re: [Company]

Hi [name],

Following up from last week. Also worth sharing: we just [new milestone - customer win, revenue jump, press, etc.].

Momentum is building. Still raising, still have room in the round.

Worth 20 minutes?

[Your name]

---
**Why it works:** Traction updates as follow-ups are the highest-converting follow-up type. It's not "did you see my email" - it's "things are moving, here's proof." If you can share a real update every 5–7 days, do it.`,
      },
      {
        heading: "LinkedIn Messages",
        body: `**Connection Request Note (300 char max):**
Hi [name] - I'm building [Company], [one-liner]. I've been following your work on [portfolio company / theme]. Would love to connect.

---
**First Message After Connection:**
Thanks for connecting, [name].

[Company] - [one-liner]. We're at [key metric] and raising ₹[X]Cr.

I know your time is valuable - happy to share a 1-pager or short deck if it makes sense to take a look.

---
**Message if They View Your Profile But Don't Respond to Email:**
Hi [name] - noticed you looked at my profile. I reached out via email last week about [Company]. Happy to send a deck or connect briefly if you'd like.

---
**Why these work:** LinkedIn messages should be shorter than email. Under 100 words always. The profile-view message is very high-converting because it references a signal they gave you.

---
**India-specific channel notes:**
- WhatsApp: Only message investors on WhatsApp if you have a genuine warm connection or they've publicly shared their number. Unsolicited WhatsApp messages are worse than cold email.
- Twitter/X: Engaging with an investor's thread before DMing converts better than a cold DM. Reply thoughtfully to 2–3 of their tweets, then DM.
- VC events (Blume portfolio days, Elevation Basecamp, Sequoia Surge): in-person events are the highest-converting channel. A 5-minute conversation at an event is worth 10 cold emails.`,
      },
      {
        heading: "What Kills Cold Emails - And How to Fix Them",
        body: `**Mistake #1: Too long**
The average investor spends 8 seconds on a cold email. If your email requires scrolling, it gets archived.
Fix: 80 words maximum. If you can't say it in 80 words, you don't know what you're asking.

**Mistake #2: Leading with background, not traction**
❌ "I spent 6 years at McKinsey and then built X at Y..." (who cares, not yet)
✅ "We crossed ₹50L MRR last month. I'm [Name], co-founder of [Company]."
Fix: Traction or insight in sentence 1. Background in sentence 2 if needed.

**Mistake #3: Asking for funding in email #1**
❌ "We're raising ₹3 Cr and looking for lead investors..."
✅ "Would you be open to a 20-minute call?"
Fix: The email gets a call. The call gets the meeting. The meeting gets the investment. Don't skip steps.

**Mistake #4: Generic subject lines**
❌ "Introduction - [Company Name]" / "Fundraising - [Sector]"
✅ "[Company] - ₹40L MRR, raising seed" / "Something I noticed about your investment in [portfolio co]"
Fix: Your subject line must make them feel something is in it for them specifically.

**Mistake #5: Sending to the wrong person**
Many VC firms have junior associates who screen emails. Your warm intro needs to go to a partner. Research who at the fund leads your sector.
Fix: Check the fund's website for sector focus by partner. Use LinkedIn to identify who led investments in your comp set.

**Mistake #6: No credibility anchor**
❌ "We think this is a big opportunity and we have a great team"
✅ "Our largest customer is [recognisable company]. They went from ₹0 to ₹5L/month with us in 90 days."
Fix: One specific, verifiable fact that makes the investor think "that's real."

---
**Response rate benchmarks (realistic for Indian VCs):**
- Cold email, no warm intro: 2–5% response rate
- Warm intro from portfolio founder: 40–70% response rate
- Warm intro from another VC: 30–60% response rate
- Alumni network intro: 15–30% response rate

This is why warm intros are non-negotiable. Your first job is to get warm - not to write better cold emails.`,
      },
    ],
  },
  {
    slug: "fundraising-checklist",
    title: "Pre-Fundraise Readiness Checklist",
    description:
      "A 40-point checklist covering everything from financial model hygiene to cap table structure, before you talk to a single investor.",
    price: 19900,
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
✅ Pass: Regulatory change, infrastructure shift, or behaviour change happened - you can name it.
❌ Fail: Your answer is "the market is big and growing."

**4. Why You**
Do you have an unfair advantage - domain expertise, distribution, proprietary data, or network - that you can articulate clearly?
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
Do you have a clear view of the competitive landscape - not just direct competitors but substitute behaviours?
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
❌ Fail: "Around ₹X lakhs" - vague is a red flag.

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
✅ Pass: 4-year vest, 1-year cliff - or a clear departure from standard that's documented.
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
❌ Fail: "We talk to customers all the time" - without structured data.

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
✅ Pass: Deck, model, legal docs, customer evidence - all accessible from one link.
❌ Fail: Files scattered across email threads.`,
      },
      {
        heading: "Top 20 Questions Indian Investors Ask - And How to Answer Them",
        body: `These are the questions that come up in 80% of seed and pre-Series A meetings with Indian VCs. Prepare written answers to all 20 before your first meeting.

---
**ON TRACTION & METRICS**

**Q: What's your MRR/ARR and growth rate?**
Don't just say the number. Say the trajectory: "We're at ₹45L MRR - up from ₹12L MRR six months ago. That's 25% MoM for the last 5 months." Growth rate with context is more valuable than the absolute number.

**Q: What's your churn?**
Give gross and net. "Monthly gross churn is 3.5%. Net revenue retention is 112% because we have strong expansion from existing customers." If your churn is high, acknowledge it and explain the driver and fix.

**Q: What does your cohort retention look like?**
They want to see a cohort table - monthly revenue retained from each cohort over time. If you don't have this, build it before fundraising.

**Q: What's your CAC and LTV?**
Don't bluff. If you don't have enough data for a reliable LTV, say: "We don't have 24-month cohort data yet, so our LTV estimate is based on [X] - but our gross margin is [Y]% and average contract length is [Z] months, implying LTV of ₹[A]." Transparent assumptions are better than confident wrong numbers.

---
**ON MARKET & COMPETITION**

**Q: How big is the market?**
Lead with a bottoms-up calculation, not a Statista quote. "[X] companies in India with [Y] characteristic × ₹[Z] ACV = ₹[A] SAM." Then say your TAM and why you believe the market is growing.

**Q: Who are your competitors and why do you win?**
Name them. Don't say "there's no one doing exactly what we do" - they'll Google it and lose trust in you. Say: "The closest alternatives are [A] and [B]. Here's where we're genuinely better and where they're better than us. We win when [specific scenario]."

**Q: Why won't [well-funded competitor] crush you?**
"They're solving [X]. We're solving [Y], which is a different use case / segment / geography. Their customers often need both. Also, [moat: data advantage / switching costs / specific distribution you have]."

---
**ON BUSINESS MODEL**

**Q: Walk me through your unit economics.**
CAC, LTV, payback period. Be ready to defend every assumption. If payback is > 18 months, have an explanation for why that's acceptable in your market.

**Q: How does this scale?**
They want to understand your gross margin trajectory and whether the business gets better or worse at scale. "Today our gross margin is 65%. At 3x revenue, we expect it to reach 75% because [specific fixed cost leverage]."

**Q: What's your pricing strategy?**
"We charge ₹[X]/month for [Y users]. We've tested [lower price] and [higher price] - [higher price] converts as well and dramatically improves LTV. We're moving upmarket deliberately."

---
**ON TEAM**

**Q: Why are you the right team for this?**
Don't just list credentials. Tell the story of why you specifically have insight that others don't. "I spent 6 years as finance head at a D2C company. I lived this problem - and I know where every existing solution falls short."

**Q: Who are you missing and who will you hire?**
Show self-awareness. "We're thin on enterprise sales. The raise includes hiring a VP Sales with enterprise SaaS experience - we have 2 candidates in final stages."

---
**ON FUNDRAISING**

**Q: How much are you raising and why that amount?**
"₹4 Cr. 18 months runway. Specific milestones: ₹2.5 Cr ARR, 5 enterprise customers, Series A ready." Don't say "to grow." Show exactly what the money buys and what state you'll be in at the end of it.

**Q: What's your target valuation?**
Be direct. "We're raising at ₹20 Cr pre-money." Then justify it: "That's 18x our current ARR, in line with comparable seed raises for B2B SaaS at our growth rate in India."

**Q: Who else are you talking to?**
You don't have to reveal names. "We're in conversations with [X] other funds. We expect to close by [date]." Creating urgency is legitimate - just don't lie about it.

**Q: What happens if you don't raise?**
"We have [X] months runway on current burn. We're also profitable on a contribution margin basis, so we can extend runway by [cutting X] if needed." Show you're not desperate.

**Q: What's your exit strategy?**
"We're building for the long term - but in this space, strategic acquirers would include [major banks / HR software consolidators / ERP players]. The most likely path is a strategic acquisition at Series B/C or an IPO if we reach ₹100 Cr ARR."`,
      },
    ],
  },
  // ─── STARTUP ─────────────────────────────────────────────────────────────────
  {
    slug: "first-10-customers-playbook",
    title: "First 10 Customers Playbook",
    description:
      "The exact outreach scripts, pricing conversations, and close tactics used to land the first 10 paying customers - without a brand, a case study, or an ad budget.",
    price: 19900,
    tag: "playbook",
    category: "startup",
    comingSoon: false,
    preview:
      "Scripts for cold outreach, discovery calls, objection handling, and pricing conversations - written for zero-proof-point situations.",
    sections: [
      {
        heading: "Why the first 10 are different",
        body: `The first 10 customers are not a scaled-down version of what comes later. They're a different game entirely.

Later, customers buy because others have. They trust your case studies, your brand, your reviews. In the beginning, they're buying *you* - your credibility, your conviction, your ability to make them feel like this is worth the risk.

Most founders try to skip to the end: deck, landing page, ad. That's a mistake. The first 10 require direct, human selling. No shortcuts.

This playbook is built for B2B SaaS and services with deal sizes between ₹5K and ₹5L/year. Adjust for your context.`,
      },
      {
        heading: "The List: Who to Target First",
        body: `Before you write a single message, build a list of 50 potential first customers. Not 10 - 50. You'll convert roughly 20%, so you need the pipeline.

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
        body: `**Warm Network - Email:**

Subject: Quick question - [their company]

Hi [Name],

Hope you're well. I'm working on something new and you're literally the first person I thought of.

I'm building [Company] - [one-liner]. Given your work at [their company], I think you might be facing [specific problem] right now.

I'm not pitching you - I'd genuinely love 20 minutes to understand how you currently [solve the problem]. And if what I'm building is relevant, I'll show you.

Would Thursday or Friday work?

[Your name]

---
**Note:** "I'm not pitching you" does two things: (1) it lowers their guard, (2) it sets up a discovery call, not a sales call. You learn more in discovery calls.

---
**Lukewarm - LinkedIn:**

Hi [Name] - we met at [event / via mutual] a while back.

I'm building [Company] - [one-liner]. I think [their company] might be an interesting fit because [specific reason].

Would you be open to a 15-minute call? I'd genuinely love your take on the problem before I sell anything.

---
**Cold - Email (only after warm channels exhausted):**

Subject: [Specific trigger: "Saw your recent hire for [role]"]

Hi [Name],

Noticed [Company] recently [trigger event]. That usually means [implication - the problem your product solves].

I'm building [Company] - [one-liner]. We're early, which means you'd be a design partner with direct input on the product, not just a customer.

Worth 20 minutes?

[Your name]`,
      },
      {
        heading: "The Discovery Call",
        body: `**Structure (20–25 minutes):**

**Opening (2 min):**
"Thanks for making time. I want to be upfront - I'm early-stage and I'm talking to [X] people this week to understand the problem before I sell anything. So this is more of a learning conversation. Is that ok?"

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

"Based on what you've described - [summarise their problem back to them in their words] - that's exactly what [Company] is built for. Can I show you quickly?"

---
**The close (3–5 min):**
"Would this be useful for you?"

If yes: "We're working with our first 10 customers as design partners. That means you get the product at [X]% of the eventual price, you have direct access to me, and your feedback shapes the roadmap. The cost is ₹[X] for [period]. Does that work?"

**Don't offer a free trial. Don't offer a pilot. Ask for money.**`,
      },
      {
        heading: "Handling Objections",
        body: `**"Can I see a case study first?"**

"I don't have one yet - you'd be one of the first. That's actually why I'm offering design partner pricing. The upside for you is you get to shape the product. Most of our best features will come from conversations like this one."

---
**"Can we start with a free trial?"**

"I don't do free trials - not because I don't believe in the product, but because I've found that paid customers get 10x more value. When you've paid, you use it properly. Can we do ₹[X] for the first month with a full refund if it's not what I described?"

---
**"Your product is too early / you don't have all the features we need"**

"What's the one feature you'd need to see to move forward? If I can build it in [X weeks], would you commit today?"

---
**"I need to think about it"**

"Of course. What specifically would you need to see to feel confident? [Listen.] If I can address that, would you be ready to go?"

Never end a call without a specific next step - a date, a deliverable, or a clear "no."

---
**"It's too expensive"**

"What budget does make sense for solving [the problem]?" [Let them anchor.]

If their number is workable: "I can work with ₹[X] for the first [period] - but I'd want a 6-month commitment so I can actually build something meaningful for you. Does that work?"`,
      },
      {
        heading: "After They Say Yes",
        body: `**Invoice immediately.** Don't wait. Send the invoice within 30 minutes of a verbal yes. Use Razorpay, Instamojo, or a simple payment link. Deals that don't get invoiced same-day close at 50% the rate.

**Onboard personally.** Your first 10 customers get a 1:1 onboarding call with you. Not a Loom. Not a doc. You.

**Set up a communication channel.** A shared WhatsApp group or Slack channel. Direct access to you. This is the design partner relationship - use it.

**Ask for a referral.** After your first delivery milestone: "If this has been useful, is there one person at [peer company] you could introduce me to?" The first 10 customers are your most powerful distribution if they're happy.

**Send a monthly update.** Even if it's 3 bullet points. Keep them in the loop. Customers who feel like insiders don't churn.`,
      },
      {
        heading: "Sample Discovery Call Transcript",
        body: `This is what a good discovery call actually sounds like. Read it before your first call - then re-read it after.

---
**Context:** You're building a B2B SaaS tool that automates vendor invoice processing for D2C brands. You're calling Rahul, CFO at a ₹20 Cr/year skincare brand.

---
**You:** Thanks for taking the time, Rahul. Quick context - I'm researching how D2C finance teams manage vendor invoices. I'm not pitching anything today; I genuinely want to understand your current process before I build. Is that okay?

**Rahul:** Sure, go ahead.

**You:** Walk me through the last time you had to process a big batch of vendor invoices. What actually happened?

**Rahul:** We had about 80 invoices from our packaging and logistics vendors last month. My team manually enters them into Tally, then our accountant reconciles against the POs. It usually takes 3–4 days.

**You:** What's the hardest part of those 3–4 days?

**Rahul:** The matching. Sometimes a vendor sends a combined invoice for 3 POs, and my accountant has to split it manually. Last month we missed a ₹4L discrepancy because of a split invoice.

**You:** How often do those discrepancies come up?

**Rahul:** Every month. Sometimes twice a month.

**You:** What have you tried to fix it?

**Rahul:** We tried an accounting software plugin once - it couldn't handle the complexity of our vendor invoicing. We went back to manual.

**You:** If you could wave a magic wand and fix one thing about this process, what would it be?

**Rahul:** Honestly? Just flag the discrepancies automatically before they hit the books. I don't need to automate everything - I just need to know when something's off before it causes a problem.

**You:** [pause] Based on what you've described - manual matching, discrepancies slipping through, 3–4 days every month - that's exactly the problem we're solving. Can I show you what we've built? It'll take 5 minutes.

**Rahul:** Sure.

**You:** [demo - shows automated discrepancy flagging with one click]

**You:** If this had flagged that ₹4L discrepancy automatically, would that have been worth ₹5,000 a month to you?

**Rahul:** [laughs] That ₹4L discrepancy cost me 2 weeks of back-and-forth. ₹5,000 is nothing.

**You:** We're working with our first 10 design partners at ₹4,999/month. You'd have direct access to me, and I'd personally help with onboarding. The first month has a full refund if it's not what I described.

**Rahul:** Let me think about it - can you send me something in writing?

**You:** Absolutely. Before I do - is there anything specific you'd need to see in writing that would make you confident to move forward?

---
**What worked in this call:**
- "I'm not pitching" at the start → relaxed the conversation
- Specific follow-up questions ("How often?", "What have you tried?") → got to the real pain
- Reflected their words back before pitching → showed genuine listening
- Anchored price against a real cost (₹4L problem vs. ₹5K/month solution)
- Didn't end with "I'll send something" - asked what would make them say yes`,
      },
      {
        heading: "India-Specific Notes for Your First 10",
        body: `**WhatsApp is your CRM for the first 10.**
For your first 10 customers, WhatsApp will do more than any CRM. Create individual chats, not a group - they need to feel like the only customer. Send updates, share prototypes, get feedback. Most Indian SMB and startup founders are more responsive on WhatsApp than email.

**The referral culture works differently in India.**
Indian founders are generally willing to refer you to peers - but they need to have experienced a win first. Don't ask for a referral in the first week. Wait until you've delivered something concrete. Then ask specifically: "Is there anyone in [specific community - like YourStory network / IAN members / your XLRI batch] who faces this problem?"

**Communities to tap before cold outreach:**
- iSPIRT SaaS community (B2B SaaS founders)
- LetsVenture founder network
- Local startup clusters: T-Hub (Hyderabad), NSRCEL (Bangalore), CIIE (Ahmedabad)
- WhatsApp groups: sector-specific CFO networks, D2C brand founder groups (these exist and are active)
- Alumni networks: IIT/IIM alumni in relevant roles are highly accessible via LinkedIn

**Pricing reality check for Indian B2B:**
₹5,000–₹20,000/month is the sweet spot for early design partners in Indian SMB. For enterprise, ₹50,000–₹2,00,000/year is common for seed-stage pilots. Don't price below ₹3,000/month - customers who pay that little don't engage seriously.

**The "chai pe charcha" close:**
For local markets, in-person meetings convert 3x better than video calls. Offer to visit their office for the first 10 customers if they're in your city. "Let me come show you in person" is under-used and over-effective.`,
      },
    ],
  },
  {
    slug: "hiring-your-first-5",
    title: "Hiring Your First 5: The Startup Hiring Playbook",
    description:
      "Job descriptions, interview scorecards, offer letter templates, and the questions that actually predict performance for early-stage hires.",
    price: 19900,
    tag: "playbook",
    category: "startup",
    comingSoon: false,
    preview:
      "Includes: JD templates for engineer/PM/growth roles, a structured scorecard, offer letter template, and 40 interview questions sorted by role.",
    sections: [
      {
        heading: "Who to hire first (and who to wait on)",
        body: `**The trap:** hiring people who look good on paper instead of people who solve your actual problem.

**The rule:** your first 5 hires should be people who can own a problem entirely - not people who need to be managed.

**Hire first:**
- Someone who can extend your technical capability (if you're not technical) or your go-to-market capability (if you are)
- The role where your absence is the biggest bottleneck

**Wait on:**
- Specialists (data scientists, designers, legal) - use contractors until the work is consistent enough to justify full-time
- Managers - you don't need management layers at 5 people
- "Good to have" roles - only hire when you can articulate the specific outcome you expect in 90 days

**The 90-day test:** Before posting any role, write the sentence: "In 90 days, I'll know this hire worked if [specific, measurable outcome]." If you can't write that sentence, you're not ready to hire for the role.`,
      },
      {
        heading: "Job Description Templates",
        body: `**Full-Stack Engineer (Founding Engineer)**

We're [Company] - [one-liner]. We've hit [traction]. We're building [X] and we need someone who can own the backend/frontend and not wait to be told what to build.

**What you'll do:**
- Own [specific product area] end-to-end
- Ship weekly - we move fast and you'll be expected to keep up
- Talk directly to customers and translate feedback into features

**What we're looking for:**
- [X]+ years building production systems (not just side projects)
- Strong opinions about code quality, with the pragmatism to ship anyway
- You've worked in a small team before - you know what it's like when there's no hand-holding

**What we offer:**
- ₹[X]–[X]L CTC + ESOP
- Direct access to founders, no bureaucracy
- The chance to shape something from [current stage] to [next stage]

---
**Growth / Marketing (First Marketer)**

We have product-market fit and [traction]. Now we need to grow. We're looking for someone who can run experiments, not just write briefs.

**What you'll do:**
- Own user acquisition - figure out what works, double down, kill what doesn't
- Run [channels: SEO / paid / content / partnerships] with a clear ROI lens
- Build the growth function from scratch

**What we're looking for:**
- You've grown something before - a product, a channel, a community
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
3 = Clear but passive - waits to be asked
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
When a candidate asks about ESOP value, don't oversell. Say: "Our current valuation is ₹[X]Cr. Your [X] options represent [X]% of the company on a fully diluted basis. At our target exit of ₹[X]Cr, that's ₹[X] - but I'd rather you value it at zero and be pleasantly surprised."

Founders who oversell ESOP create resentment when reality hits. Be conservative.`,
      },
      {
        heading: "India Salary Benchmarks (2024–25)",
        body: `Use these ranges as a starting point. Adjust ±20% for city (Bangalore/Mumbai = higher, Delhi/Pune = mid, Hyderabad = slightly lower, Tier 2 = 20–30% lower), and ±15% for domain expertise.

**ENGINEERING**
| Role | Pre-Seed / Bootstrapped | Seed Stage | Series A |
|---|---|---|---|
| Founding Engineer (5–8 yrs) | ₹18–28L CTC | ₹25–40L CTC | ₹35–60L CTC |
| Senior SWE (3–5 yrs) | ₹14–20L | ₹18–30L | ₹25–45L |
| Junior SWE (0–2 yrs) | ₹8–14L | ₹10–18L | ₹14–24L |
| Mobile Engineer (iOS/Android) | ₹16–26L | ₹22–35L | ₹30–50L |
| Data Engineer / ML | ₹18–30L | ₹25–45L | ₹35–65L |

**PRODUCT & DESIGN**
| Role | Pre-Seed | Seed | Series A |
|---|---|---|---|
| First PM (4–7 yrs) | ₹16–24L | ₹22–35L | ₹30–50L |
| Senior PM | ₹20–32L | ₹28–45L | ₹40–65L |
| Product Designer (UI/UX) | ₹10–18L | ₹14–25L | ₹20–38L |

**SALES & GROWTH**
| Role | Pre-Seed | Seed | Series A |
|---|---|---|---|
| First Salesperson (B2B) | ₹10–16L + 50% variable | ₹14–22L + variable | ₹18–30L + variable |
| Growth / Marketing | ₹12–18L | ₹16–26L | ₹22–38L |
| Customer Success | ₹8–14L | ₹10–18L | ₹14–24L |

**OPERATIONS & FINANCE**
| Role | Pre-Seed | Seed | Series A |
|---|---|---|---|
| Ops Generalist (2–5 yrs) | ₹10–16L | ₹14–22L | ₹18–30L |
| Finance / FP&A | ₹12–18L | ₹16–24L | ₹22–35L |
| HR / People Ops | ₹10–16L | ₹14–22L | ₹18–28L |

**C-SUITE (Seed / Series A)**
| Role | Seed | Series A |
|---|---|---|
| CTO (external hire) | ₹30–50L + 0.5–1.5% ESOP | ₹45–80L + 0.3–1% ESOP |
| CFO | ₹25–45L + 0.3–0.8% ESOP | ₹40–70L + 0.2–0.5% ESOP |
| VP Sales | ₹20–35L + 0.3–0.8% ESOP | ₹30–55L + 0.2–0.5% ESOP |

**ESOP benchmarks for early hires (% fully diluted):**
- Founding engineer (hire #1–3): 0.5–1.5%
- Engineer (hire #4–10): 0.1–0.5%
- First PM: 0.3–0.8%
- First salesperson: 0.1–0.3%
- C-suite hire at seed: 0.5–1.5%
- C-suite hire at Series A: 0.2–0.8%

**Practical note:** Early-stage startups in India typically pay 20–30% below market cash - ESOP bridges the gap. Be transparent about this trade-off. Candidates who aren't willing to take any risk on ESOP rarely perform well in startup environments.`,
      },
      {
        heading: "Onboarding Checklist - First 30/60/90 Days",
        body: `**BEFORE DAY 1:**
☐ Laptop ordered and set up (don't make them wait on day 1)
☐ All accounts created: email, Slack, GitHub/Notion/Jira, AWS/GCP
☐ Welcome message sent the day before
☐ First week's calendar pre-blocked: team intros, 1:1 with you, product demo

**DAYS 1–7 (Orientation):**
☐ Company overview: where you are, where you're going, what the next 6 months look like
☐ Product walkthrough: give them the full demo - same one you give investors
☐ Customer context: make them read 5 customer call recordings or transcripts
☐ Codebase / system walkthrough (for engineers): 30 minutes, not 3 hours
☐ First small task: something achievable in week 1 that gives them a win
☐ Introduction to top 3 customers (if relevant to their role)

**Days 8–30 (Contribution):**
☐ First "real" project assigned with clear success criteria
☐ Daily async standup: "what did you do, what will you do, any blockers"
☐ Weekly 1:1 with you (30 minutes, structured - see 1:1 template in Founder OS)
☐ Feedback at day 14: "here's what's going well, here's what I'd change"

**Days 31–60 (Ownership):**
☐ Own one area end-to-end - from problem definition to shipping
☐ Start building relationships with customers or partners independently
☐ Identify and fix one internal process that's broken

**Day 60 Check-in:**
Ask yourself: "If I had to decide today whether to keep this person, what would I say?"
If the answer isn't a clear yes, have the hard conversation at day 60, not day 89.

**Day 90 Review (formal):**
☐ Review against the 90-day outcome you wrote before hiring
☐ Confirm employment (or extend probation with specific goals)
☐ Set next 90-day goals together - their input, your sign-off

**The single most common onboarding mistake:**
Giving new hires too little to do in week 1. They feel useless. They doubt the company. They start updating their LinkedIn. Give them something real on day 1, even if it's rough.`,
      },
    ],
  },
  {
    slug: "product-spec-templates",
    title: "Product Spec Templates",
    description:
      "PRD templates, user story frameworks, and feature prioritisation scorecards for early-stage product teams that don't have the luxury of a dedicated PM.",
    price: 19900,
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
List anything unresolved. Don't hide ambiguity - surface it.

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

Build a table with all your candidate features, calculate their scores, sort by RICE descending. Then gut-check: does the ranking feel right? If not, your estimates are off - adjust them.`,
      },
      {
        heading: "User Story Framework",
        body: `**The format:**
As a [persona], when [context/trigger], I want to [action/goal] so that [outcome/benefit].

**Why the trigger matters:** Most user stories skip the "when" - which means they describe a feature without anchoring it in a real moment. The trigger is what makes a story useful for design and engineering.

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
      "A structured system for running, tracking, and learning from growth experiments - with 30 pre-built experiment ideas across SEO, paid, content, and referral.",
    price: 19900,
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
☐ Scale - it worked, double down
☐ Iterate - promising signal, change [X] and retest
☐ Kill - no signal, move on
☐ Inconclusive - run longer / with more volume

**What we learned:**
[Most important insight, even from failures]`,
      },
      {
        heading: "3 Detailed Experiment Case Studies",
        body: `These are real-world examples of how to run, measure, and learn from growth experiments. Use them as templates for your own log.

---
**CASE STUDY 1: B2B SaaS - Competitor comparison page**

**Company context:** HR-tech SaaS, ₹15L MRR, targeting Indian SMBs

**Hypothesis:** If we create a "[Company] vs. [Competitor A]" comparison page targeting founders actively comparing HR tools, organic traffic from high-intent searchers will convert to demos at 3x the rate of our homepage (current: 1.2%).

**What we built:** A 1,500-word comparison page - their strengths, our strengths, honest comparison table, 3 customer quotes. Took 2 days to write, 1 day to design and publish.

**Measurement:** Google Search Console (impressions, CTR), GA (page traffic), HubSpot (demo requests from that URL), 60-day window.

**ICE Score:** Impact 8, Confidence 7, Ease 8 = **7.7**

**Results (Day 60):**
- Organic impressions: 1,400/month (ranking #4 for "CompetitorA alternative India")
- Page traffic: 280 visitors/month
- Demo requests from page: 11 = **3.9% conversion rate** (vs. 1.2% homepage)
- CAC from this channel: ₹8,400 (vs. ₹22,000 from paid)

**Decision:** Scale - build 3 more comparison pages for competitors B, C, D.

**What we learned:** High-intent searchers (people already comparing tools) convert 3x better than cold traffic. Time investment (3 days) with indefinite SEO payoff - best ROI experiment we ran all quarter.

---

**CASE STUDY 2: D2C - Reactivation email sequence**

**Company context:** Skincare brand, ₹40L monthly revenue, 18% monthly churn from subscription customers

**Hypothesis:** If we send a 3-email reactivation sequence to subscribers who haven't ordered in 60+ days, we'll reactivate 8% of them (current reactivation rate: 2%).

**What we built:**
- Email 1 (Day 0): "We miss you" + personal note from founder + 10% discount
- Email 2 (Day 4): Customer testimonial from similar skin type + soft CTA
- Email 3 (Day 8): "Last chance" + 15% discount, emphasising what they'll lose (subscription benefits)

**Measurement:** Klaviyo segment (lapsed 60+ days), open rate, click rate, purchase rate, 30-day window.

**ICE Score:** Impact 7, Confidence 6, Ease 9 = **7.3**

**Results (30 days):**
- Segment size: 1,240 subscribers
- Email 1 open rate: 42%, click rate: 8%
- Email 2 open rate: 31%, click rate: 5%
- Email 3 open rate: 28%, click rate: 6%
- Total reactivated: 87 subscribers = **7% reactivation** (target: 8%)
- Revenue recovered: ₹2.6L (87 × avg ₹3,000 order)
- Cost: ₹0 (existing Klaviyo subscription)

**Decision:** Iterate - test earlier trigger (45 days instead of 60) and personalise Email 1 with their last product ordered.

**What we learned:** Near-target performance but Email 3's discount was the primary converter (62% of reactivations came from that email). Test Email 3 earlier. Also: 42% open rate on "We miss you" = relationship-style subject lines outperform promotional ones.

---

**CASE STUDY 3: B2B Services - Inbound lead magnet**

**Company context:** Fractional CFO services firm, 8 clients, targeting seed-stage startups

**Hypothesis:** If we publish a free "Financial model template for Indian SaaS startups" as a lead magnet with email capture, we'll generate 30+ qualified leads per month (founders who need a CFO).

**What we built:** A Google Sheets financial model (3-year, with Indian tax assumptions, pre-filled examples). Landing page with email capture. 3 follow-up emails nurturing to a discovery call.

**Distribution:** Posted in 4 startup WhatsApp groups, 2 LinkedIn posts by founder, 1 newsletter mention from a founder friend.

**Measurement:** Landing page conversion rate, email captures, discovery calls booked, 45-day window.

**ICE Score:** Impact 9, Confidence 5, Ease 6 = **6.7**

**Results (45 days):**
- Landing page visits: 1,840
- Email captures: 312 = **17% conversion**
- Follow-up email sequence open rate: 51% (Day 1), 38% (Day 3), 29% (Day 7)
- Discovery calls booked: 22
- Clients signed from sequence: 3 = ₹4.5L ARR (at ₹1.5L/year per client)
- Cost: 4 days to build the model, 1 day for landing page

**Decision:** Scale - paid distribution (targeted LinkedIn ads to founders), build 2 more lead magnets (burn rate calculator, cap table simulator).

**What we learned:** The WhatsApp distribution generated 70% of traffic in the first week - more than LinkedIn. Founder communities sharing useful tools is more powerful than ads at this stage. The 3 clients came from the Day 7 email ("last chance" framing). Worth A/B testing Day 7 as Day 5.`,
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
      "A planning and review system for solo founders and small teams - weekly review template, OKR framework, decision log, and a meeting structure that doesn't waste everyone's time.",
    price: 19900,
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
[ ] Yes - [what happened]
[ ] No - [honest reason why not]

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

That's it. If you have more than one objective, you don't have a strategy - you have a list.

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
How are you actually doing? (Not work - person.)

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
- Don't skip them when you're busy - that's exactly when they matter most
- Don't do all the talking
- Don't wait for the 1:1 to give feedback - give it in the moment, use 1:1 to follow up`,
      },
      {
        heading: "Sample Filled-In Weekly Review & OKR Example",
        body: `**SAMPLE WEEKLY REVIEW - Week of June 2, 2025**

*This is a real-looking example of what a filled weekly review looks like. Use it as a reference for what good looks like.*

---
**Section 1: Last week**

What was the single most important thing I said I'd do?
[x] Yes - Close Sahil (CFO at Myntra Foods) as our 8th paying customer.
Result: Closed at ₹12,000/month. He referred us to their portfolio company immediately.

What were the 3 biggest outcomes from last week?
1. Crossed ₹1L MRR (₹1,04,000 - milestone we've been working toward for 6 weeks)
2. Had discovery call with potential Series A lead (Elevation) - they want to see the model next week
3. Shipped invoice-split feature that Rahul (customer #3) has been asking for since March

What didn't get done?
- Didn't send the investor update. Need to do this Monday morning, non-negotiable.
- Didn't finish the competitive analysis for the Elevation meeting. Push to Tuesday.

What did I learn?
Sahil's referral happened within 48 hours of closing him. This tells me referral velocity is high right now - I should be asking every new customer for intros within the first week, not the first month.

---
**Section 2: This week**

**The one thing:** Deliver a compelling financial model + investor update to Elevation by Thursday EOD.

If I achieve only one thing this week, it's: [Send Elevation a clean model that shows the ₹5 Cr ARR path by Q4 2026]

This week's tasks:
Monday: Send investor update (30 min), finish competitive analysis (2 hrs)
Tuesday: Rebuild financial model - 3-year, India SaaS assumptions (4 hrs)
Wednesday: Call with Elevation partner - practice pitch with Shreya first (90 min)
Thursday: Follow-up on 3 pipeline prospects, send Elevation model
Friday: Weekly retro with team, plan next week

This week's blockers:
Elevation wants our gross margin calculation - need to get the number from CA by Tuesday. Email him today.

---
**Section 3: Energy**
Energy level: 8/10 - ₹1L MRR crossed feels like a real inflection point.
Focus protection: No Slack after 7pm this week. Too many late-night spirals that don't produce decisions.
What I'm avoiding: The contracts backlog. Need to just do 2 per day starting tomorrow.

---
**SAMPLE QUARTERLY OKR - Q3 2025 (July–September)**

**Objective:** Finly becomes the default finance operations tool for D2C brands in India.

**KR 1:** ARR goes from ₹1.2 Cr to ₹2.5 Cr
*Current: ₹1.2 Cr | Target: ₹2.5 Cr | Weekly add needed: ₹5L ARR/week*

**KR 2:** NRR (Net Revenue Retention) reaches 115%+
*Current: 108% | Target: 115% | Driver: Launch expansion module for multi-entity brands*

**KR 3:** Land 5 enterprise customers (₹3L+ ARR each)
*Current: 1 | Target: 5 | Channel: Direct outreach via Elevation intro network*

---
**Weekly OKR check-in (example, Week 6 of Q3):**

KR 1: ARR = ₹1.8 Cr. On track? **At risk.** Added only ₹30L ARR this week vs. ₹50L needed. Need to review pipeline - too many stalled deals in "proposal sent" stage. Action this week: personally call every stalled deal.

KR 2: NRR = 111%. On track? **Yes.** Expansion module shipped. Ayushi (customer #6) upgraded to the multi-entity plan last week.

KR 3: Enterprise customers = 2. On track? **Behind.** Only added 1 enterprise customer in 6 weeks. Problem: enterprise sales cycle is 8–12 weeks and we started outreach too late in Q3. Push target to 3 enterprise and move the 5-enterprise goal to Q4.

---
**Quarter-end review (example):**

Objective: Finly becomes the default finance operations tool for D2C brands in India.

KR 1: Target ₹2.5 Cr / Actual ₹2.1 Cr / Score 0.72
What drove it: Strong new customer acquisition. Let down by 2 churns (both were SMBs below ₹3K/month - we'll raise floor price next quarter).

KR 2: Target 115% / Actual 117% / Score 1.0 ✅
What drove it: Expansion module - every multi-entity customer upgraded within 30 days of launch.

KR 3: Target 5 enterprise / Actual 3 / Score 0.6
What happened: Pipeline was there. Sales cycle longer than estimated. In Q4, start enterprise outreach in month 1 not month 2.

Key learning this quarter: Our enterprise segment has 2x the LTV of SMB and 60% lower churn. Shift ICP focus upmarket in Q4.`,
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

When someone raises a debate you've had before, link them to the entry instead of repeating the conversation. If the context has changed enough to warrant re-opening it, update the log - don't just discuss and forget again.

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

  // ─── FUNDRAISE - LEGAL & DEAL DOCS ───────────────────────────────────────────
  {
    slug: "term-sheet-template",
    title: "Term Sheet (CCD, CCPS, Equity, SAFE)",
    description:
      "Ready-to-use term sheet templates for the four most common Indian fundraising instruments - Compulsorily Convertible Debentures, Preference Shares, Equity, and SAFE notes.",
    price: 19900,
    tag: "legal",
    category: "fundraise",
    comingSoon: false,
    preview: "Four instrument-specific term sheets, annotated with negotiation notes on each key clause.",
    sections: [
      {
        heading: "CCD Term Sheet Template",
        body: `**TERM SHEET - COMPULSORILY CONVERTIBLE DEBENTURES**

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
        body: `**TERM SHEET - COMPULSORILY CONVERTIBLE PREFERENCE SHARES**

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
        body: `**TERM SHEET - EQUITY INVESTMENT**

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
[X]% - Product & Engineering
[X]% - Sales & Marketing
[X]% - Team (Hiring)
[X]% - Operations & G&A

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
        heading: "Negotiation Notes - Key Clauses to Watch",
        body: `**Liquidation Preference**
- 1x non-participating is founder-friendly; push back hard on anything above 1x or participating preference
- Participating preference means investors get their money back AND participate in remaining proceeds - avoid

**Anti-Dilution**
- Broad-based weighted average: accounts for all outstanding shares including options - standard and acceptable
- Full ratchet: adjusts your price down to the lowest new share price - avoid at all costs
- Narrow-based: only counts issued shares - be cautious

**Valuation Cap (SAFE/CCD)**
- Negotiate the cap at 2–3x your expected next round valuation
- Too low a cap is worse than a higher discount rate - model both scenarios before agreeing

**Protective Provisions**
- Standard: veto on new share issuance, M&A, amendments to charter
- Watch out for: operational veto (new hires above ₹X, budget approvals) - push back
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
      "A practical guide to the valuation methods used in Indian startup funding rounds - DCF, comparables, scorecard, and VC method - with worked examples.",
    price: 19900,
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

That said, understanding the methods investors use lets you argue your number credibly - and spot when someone is lowballing you.

The four most relevant methods for Indian early-stage startups:
1. **Comparable Transactions (Comps)** - most commonly used in practice
2. **VC Method** - used by seed/early-stage institutional investors
3. **Scorecard Method** - used by angels and micro-VCs
4. **DCF (Discounted Cash Flow)** - rarely used pre-Series A, but you'll encounter it at growth stage`,
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
Example: You're building a B2B SaaS - similar companies have exited at ₹500–1,000 Cr.
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
- If investor offers ₹3 Cr at ₹15 Cr post-money (20% ownership), they need a 30x+ exit at ₹750 Cr - that math rarely works for a 1x fund. Push back.
- If they offer ₹3 Cr at ₹30 Cr post-money (10%), they need only 15x at exit - much more standard`,
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
- WACC (Weighted Average Cost of Capital) - typically 18–25% for Indian growth companies
- Terminal value = Year 7 EBITDA × EV/EBITDA multiple (12–18x for SaaS)

Don't lead with a DCF in early-stage pitches - it signals you don't understand how early-stage investing works.`,
      },
      {
        heading: "India Valuation Benchmarks & Worked Example",
        body: `**INDIA STARTUP VALUATION BENCHMARKS (2024–25)**

These are real ranges based on publicly reported rounds and VC conversations. Use them as sanity checks - not as floor or ceiling.

**B2B SaaS - Pre-Seed / Angel**
| ARR | Typical Pre-Money Valuation | Multiple |
|---|---|---|
| Pre-revenue / MVP | ₹3–8 Cr | N/A (team + market bet) |
| ₹10–30L ARR | ₹5–15 Cr | 15–30x ARR |
| ₹30–80L ARR | ₹12–30 Cr | 15–25x ARR |

**B2B SaaS - Seed**
| ARR | Typical Pre-Money Valuation | Multiple |
|---|---|---|
| ₹50L–₹1.5 Cr | ₹15–40 Cr | 15–25x ARR |
| ₹1.5–3 Cr | ₹30–70 Cr | 18–25x ARR |

**B2B SaaS - Pre-Series A**
| ARR | Typical Pre-Money Valuation | Multiple |
|---|---|---|
| ₹3–6 Cr | ₹50–120 Cr | 15–22x ARR |
| ₹6–12 Cr | ₹100–200 Cr | 15–20x ARR |

**Fintech - Seed**
| Metric | Range | Note |
|---|---|---|
| TPV-based | ₹10–30 Cr valuation per ₹100 Cr monthly TPV | Regulatory risk discount applied |
| Revenue-based | 10–18x revenue | Lower than pure SaaS due to take-rate compression risk |

**D2C - Seed**
| Revenue | Typical Pre-Money | Multiple |
|---|---|---|
| ₹1–3 Cr monthly revenue | ₹15–40 Cr | 2–4x annualised revenue |
| ₹3–8 Cr monthly revenue | ₹40–100 Cr | 1.5–3x annualised revenue |
| Profitable D2C | Premium of 30–50% vs. loss-making | Profitability rewarded in India post-2022 |

**Key factors that move valuation up:**
- MoM growth > 20% for 6+ months: +30–50% premium
- NRR > 115% (SaaS): +20–30% premium
- Marquee early customers (large enterprises): +20% premium
- Profitability or clear path to profitability: +15–25% premium
- Competitive term sheet situation: +20–40% (urgency premium)

**Key factors that move valuation down:**
- High churn (> 5% monthly): -20–30%
- Single-channel dependency: -10–15%
- Regulatory risk (grey area business model): -20–40%
- Concentrated customer base (top 3 customers > 60% revenue): -10–20%

---
**WORKED EXAMPLE: Using all 4 methods**

*Company: B2B SaaS, expense management for Indian SMBs. ₹1.8 Cr ARR. Growing 18% MoM. 92% NRR. Based in Bangalore.*

**Method 1: Comparable Transactions**
Comparable raises: 2 similar Indian SMB SaaS companies raised at 20x ARR in the last 12 months.
₹1.8 Cr ARR × 20x = **₹36 Cr pre-money**
Adjustment: growth rate is strong (+10%), but NRR is below 110% (-10%). Net: ₹36 Cr.

**Method 2: VC Method**
Target exit value in 7 years: ₹300 Cr (reasonable for this category)
Investor needs: 15x on ₹3 Cr investment = ₹45 Cr return needed
Ownership needed at exit: ₹45 Cr / ₹300 Cr = 15%
Post-dilution ownership needed today: 15% / 0.64 = 23.4%
Implied post-money: ₹3 Cr / 23.4% = ₹12.8 Cr
Pre-money: **₹9.8 Cr** (much lower - VCs will push this down)

**Method 3: Scorecard**
Bangalore B2B SaaS baseline = ₹12 Cr pre-money (current market)
Adjustments: Team +15%, Market +10%, NRR risk -5% → total +20%
₹12 Cr × 1.20 = **₹14.4 Cr pre-money**

**Method 4: Comps synthesis (what you'll likely negotiate to)**
Comps say ₹36 Cr, VC method says ₹10 Cr, scorecard says ₹14 Cr.
The negotiated range: **₹18–25 Cr pre-money** for a ₹3 Cr seed round.

The founder who goes in asking for ₹36 Cr pre-money will be laughed out. The one who goes in at ₹22 Cr, with clear logic (20x ARR, strong growth, comparable raise data), will likely land between ₹18–24 Cr.`,
      },
    ],
  },
  {
    slug: "transaction-documents",
    title: "Transaction Documents (SHA & SSA)",
    description:
      "Annotated templates for Shareholders' Agreement (SHA) and Share Subscription Agreement (SSA) - the two core legal documents in every Indian VC funding transaction.",
    price: 19900,
    tag: "legal",
    category: "fundraise",
    comingSoon: false,
    preview: "Full SHA and SSA templates with clause-by-clause annotation on what to negotiate, what to accept, and what to reject.",
    sections: [
      {
        heading: "SHA Key Clauses - Template & Annotation",
        body: `**SHAREHOLDERS' AGREEMENT (KEY CLAUSES)**

Between:
1. [COMPANY NAME] ("Company")
2. [FOUNDER 1 NAME] ("Founder 1")
3. [FOUNDER 2 NAME] ("Founder 2")
4. [INVESTOR NAME] ("Investor")

---
**CLAUSE 1 - DEFINITIONS**
"Qualified Financing" means an equity financing with aggregate proceeds of at least ₹[X] Cr from one or more institutional investors.
"Exit Event" means (a) an IPO; (b) a merger, acquisition, or consolidation resulting in a change of control; or (c) a sale of all or substantially all Company assets.

*Annotation: Define Qualified Financing carefully - if the threshold is too low, minor bridges trigger conversion rights.*

---
**CLAUSE 5 - BOARD COMPOSITION**
5.1 The Board shall consist of [X] Directors.
5.2 The Investor shall have the right to nominate [1/2] Director(s) to the Board.
5.3 The Founders collectively shall have the right to nominate [X] Directors.
5.4 [X] Independent Director(s) shall be appointed by mutual consent.

*Annotation: Ensure your nominees always constitute a majority unless you've sold >50% - protect the casting vote.*

---
**CLAUSE 8 - RESERVED MATTERS**
The following actions require prior written consent of the Investor:
(a) Issuance of any new shares or securities convertible into shares
(b) Any amendment to the constitutional documents of the Company
(c) Any related-party transaction exceeding ₹[X]
(d) Acquisition or disposal of assets exceeding ₹[X]
(e) Any change in the nature of business
(f) Declaration or payment of any dividend
(g) Any single capital expenditure exceeding ₹[X]

*Annotation: (g) is the most dangerous clause. Push for a high threshold - INR 50L+ at minimum for seed stage. Operational veto rights will strangle the company.*

---
**CLAUSE 12 - VESTING AND LEAVER PROVISIONS**
12.1 All Founder shares are subject to a 4-year vesting schedule with a 1-year cliff from [INCORPORATION DATE].
12.2 Good Leaver: Departure due to death, permanent disability, or termination without cause. Unvested shares revert to the Company at Fair Market Value.
12.3 Bad Leaver: Voluntary resignation or termination for cause within the vesting period. Unvested shares revert to the Company at face value (₹[X] per share).

*Annotation: "For cause" must be exhaustively defined. Ensure it requires a Board resolution to invoke - unilateral investor invocation is a red flag.*`,
      },
      {
        heading: "SHA Key Clauses - Transfer Restrictions",
        body: `**CLAUSE 14 - TRANSFER RESTRICTIONS**

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
        heading: "SSA Template - Core Structure",
        body: `**SHARE SUBSCRIPTION AGREEMENT**

This Share Subscription Agreement ("Agreement") is entered into on [DATE] between:

1. [COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] ("Company");
2. [FOUNDER 1] and [FOUNDER 2] (together, "Founders"); and
3. [INVESTOR NAME] ("Investor")

---
**ARTICLE 2 - SUBSCRIPTION**

2.1 The Investor agrees to subscribe to, and the Company agrees to allot and issue to the Investor, [X] [CCPS / Equity Shares / CCDs] at a price of ₹[X] per share, aggregating to a total subscription amount of ₹[AMOUNT] ("Subscription Amount").

2.2 The subscription shall be completed in [one / two] tranches:
- First Tranche: ₹[X] on the Closing Date
- Second Tranche: ₹[X] on achievement of [MILESTONE] (if applicable)

**ARTICLE 3 - CONDITIONS PRECEDENT**

3.1 The obligation of the Investor to subscribe is subject to:
(a) Satisfactory completion of legal, financial, and technical due diligence
(b) No material adverse change in the business since the date of the Term Sheet
(c) Execution of the SHA
(d) Board resolution approving the allotment
(e) Shareholders' resolution (special resolution) approving the issue
(f) Receipt of any regulatory approvals required under FEMA (for foreign investors)

**ARTICLE 4 - REPRESENTATIONS & WARRANTIES**

4.1 The Company and Founders represent and warrant that:
(a) The Company is duly incorporated and in good standing
(b) The Company has the corporate power and authority to enter into this Agreement
(c) No litigation, arbitration or regulatory proceeding is pending or threatened
(d) The financial statements provided accurately represent the Company's financial position
(e) The Company has complied with all applicable laws, including labour, tax, and IP laws
(f) The Company owns or has valid licenses to all IP used in the business

**ARTICLE 7 - INDEMNIFICATION**

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
      "A complete data room checklist and template structure for Series A and beyond - covering legal, financial, commercial, and technical due diligence documents.",
    price: 19900,
    tag: "checklist",
    category: "fundraise",
    comingSoon: false,
    preview: "The full data room folder structure, document checklist (60+ items), and guidance on what to redact before sharing.",
    sections: [
      {
        heading: "Data Room Folder Structure",
        body: `**Recommended Google Drive / Notion structure:**

📁 01 - Company Overview
  - Company one-pager / executive summary
  - Pitch deck (latest version)
  - Company registration certificate
  - MOA / AOA

📁 02 - Financials
  - Audited P&L, Balance Sheet, Cash Flow (last 2–3 years)
  - Management accounts (last 12 months, monthly)
  - Financial model (3-year projections)
  - Cap table (current + post-investment)
  - Bank statements (last 3 months)

📁 03 - Legal
  - Shareholders' Agreement (existing)
  - Founders' Agreement
  - Employment agreements (key hires)
  - IP assignment agreements
  - Customer contracts (top 5)
  - Vendor agreements (material)
  - NDA register

📁 04 - Commercial
  - Customer list (with ARR, contract dates, renewal status)
  - Pipeline / CRM export
  - Churn analysis
  - Unit economics breakdown (CAC, LTV, payback)
  - Channel attribution data

📁 05 - Product & Technology
  - Product roadmap
  - Architecture overview (non-sensitive)
  - Key technology dependencies / licenses
  - Security audit report (if available)

📁 06 - Team
  - Org chart
  - Key employee profiles / LinkedIn
  - ESOP scheme document + allocation register
  - Offer letters (key hires)

📁 07 - Compliance & Regulatory
  - GST registration
  - PF & ESI registration
  - ROC filings (last 2 years)
  - FEMA approvals (if foreign investment received)
  - Any regulatory licences (fintech, healthcare, etc.)`,
      },
      {
        heading: "Due Diligence Checklist - 60 Items",
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
☐ Churn analysis - monthly cohort data
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
- Login credentials, API keys, passwords - never in a data room
- Unreleased product features or roadmap details you don't want leaked to competitors

**Create tiered access:**
- Tier 1 (Exploratory): Pitch deck, one-pager, cap table summary
- Tier 2 (Post-NDA): Full financials, customer list, legal documents
- Tier 3 (Post-Term Sheet): Employee details, full contracts, bank statements

**Use Google Drive folder permissions or Notion access control - never share an entire data room link in public channels or email threads with multiple parties.**

**Before closing the round, revoke access for all investors who passed.**`,
      },
    ],
  },
  {
    slug: "financial-model-general",
    title: "Financial Model (General)",
    description:
      "A clean, investor-ready 3-year financial model template for SaaS, D2C, and services businesses - with built-in scenario analysis and a cap table model.",
    price: 19900,
    tag: "template",
    category: "fundraise",
    comingSoon: false,
    preview: "P&L, cash flow, balance sheet, cohort model, unit economics, cap table, and scenario analysis - all linked and formula-driven.",
    sections: [
      {
        heading: "Financial Model Structure & Setup",
        body: `**This model has 7 tabs:**

1. **Inputs & Assumptions** - All hardcoded numbers live here. No hard-coding anywhere else.
2. **Revenue Model** - Monthly recurring revenue, cohort churn, expansion, new ARR
3. **Cost Model** - COGS, S&M, R&D, G&A broken into line items
4. **P&L** - Profit & Loss statement (monthly, quarterly, annual)
5. **Cash Flow** - Operating, investing, financing cash flows
6. **Balance Sheet** - Summary balance sheet
7. **Cap Table** - Pre/post money, dilution tracker

---
**INPUTS TAB - KEY ASSUMPTIONS TO FILL IN:**

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
        heading: "Revenue Model - Cohort Logic",
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

**Dilution waterfall - example to Series B:**
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
    price: 19900,
    tag: "template",
    category: "fundraise",
    comingSoon: false,
    preview: "12-slide structure, slide-by-slide guidance, annotated examples, and India-specific investor reading patterns.",
    sections: [
      {
        heading: "Deck Structure & Slide-by-Slide Guide",
        body: `**THE 12-SLIDE STRUCTURE:**

1. **Cover** - Company name, tagline, contact. Nothing else.
2. **Problem** - One slide. The problem your customer has today, not the one you've invented.
3. **Solution** - One slide. What you do. Not how. The "what."
4. **Product** - 1–2 screenshots or a demo GIF. Show, don't tell.
5. **Market** - TAM/SAM/SOM. Bottom-up, not Statista.
6. **Traction** - Your best metric, trend line, key milestones.
7. **Business Model** - How you make money, who pays, unit economics.
8. **Go-to-Market** - How you've grown, and how you'll grow with this capital.
9. **Competition** - Competitive matrix. Be honest about who else is doing this.
10. **Team** - Names, relevant experience, why you. Not a wall of logos.
11. **Financials** - 3-year projections, current runway, use of funds.
12. **The Ask** - How much, at what valuation, what you'll achieve.

---
**SLIDE PRINCIPLES:**
- Max 30 words per slide in the body
- One idea per slide - never combine two points
- Lead with data, support with narrative
- Use consistent color scheme (2–3 colors max)
- Every slide should be able to stand alone - investors often forward individual slides`,
      },
      {
        heading: "Common Mistakes & India-Specific Notes",
        body: `**THE 5 MOST COMMON DECK MISTAKES:**

1. **Problem slide describes the solution**
❌ Wrong: "There is no single platform that manages startup fundraising"
✅ Right: "Founders spend 300 hours on average fundraising - 60% of that time on admin"

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
- Indian VCs often read decks in WhatsApp forwards and screenshot chains - design for mobile readability
- Regulatory landscape slide is valued for fintech, healthcare, edtech - add it if relevant
- India-focused market size is more credible than global numbers - show you understand the local dynamics
- References to prior Indian startup exits in your space build credibility - include them in the competition slide
- Founder pedigree (IIT/IIM, prior startup, corporate experience) carries more weight in Indian VC than in the US - lead with it`,
      },
      {
        heading: "Slide-by-Slide Detailed Annotations",
        body: `**SLIDE 1 - COVER**
What's on it: Company name, 1-line tagline, your name, email.
What's NOT on it: anything else. No "confidential." No logos of investors or accelerators (yet).
Tagline format: What you do for whom. "Automated reconciliation for D2C finance teams." Not a slogan.

---
**SLIDE 2 - PROBLEM**
Goal: Make the investor feel the pain before they see the solution.
- One specific scenario, told as a story: "A D2C brand with ₹5 Cr monthly revenue has 200 vendor invoices. Their accountant spends 4 days matching them. Last month, a ₹3L discrepancy slipped through."
- Do NOT use the word "solution" on this slide.
- Quantify the pain: time lost, money lost, or frequency of occurrence.
- One image or icon that reinforces the emotion (frustrated person, overflowing spreadsheet, missed deadline).

---
**SLIDE 3 - SOLUTION**
Goal: Show what you do in one sentence and one image.
- One screenshot of the product. Not a wireframe. The real thing.
- Caption: "[Product name] does [specific thing] in [specific timeframe]."
- Three bullet points max: what it does, not how it works.
- Avoid: "AI-powered platform." Say what the AI does: "Matches invoices to POs automatically."

---
**SLIDE 4 - PRODUCT**
Goal: Show it working, not described.
- 1–2 product screenshots showing the core workflow.
- OR a 30-second GIF embedded in the deck (Canva/Figma support this).
- Caption each screenshot with the outcome: "Invoice matched in 8 seconds" not "Invoice matching screen."

---
**SLIDE 5 - MARKET**
Goal: Show the investor there's a large enough opportunity.
- Build bottom-up: "[X] companies in India that [do Y] × ₹[Z] ACV = ₹[Cr] SAM."
- TAM = total market if you had 100% share of your category.
- SAM = realistic serviceable market in your geography and segment.
- SOM = what you'll capture in 3 years.
- Sources: Your own estimates are fine if the logic is sound. Tracxn, Statista, Ministry of Commerce data for backing.

---
**SLIDE 6 - TRACTION**
The most important slide in the deck. Make the investor stop scrolling here.
- Lead with your single best metric in 72pt font: "₹45L MRR" / "2,400 paying customers" / "180% NRR."
- Support with a trend line (month-by-month for the last 6–12 months). Flat is bad. Consistent growth is good. One spike is a red flag.
- 2 secondary metrics below the hero number.
- Customer logos (if you can name them). Even 3 recognisable logos change the entire conversation.

---
**SLIDE 7 - BUSINESS MODEL**
Goal: Explain who pays, how much, and why the unit economics work.
- Pricing tiers (if SaaS): "₹5,000–₹25,000/month based on team size."
- Key unit economics: "CAC ₹12,000 / LTV ₹96,000 / Payback 4 months."
- Gross margin: "75% software gross margin."
- Revenue mix: recurring vs. one-time if both exist.

---
**SLIDE 8 - GO-TO-MARKET**
Goal: Show you understand how to grow.
- What's working today: "Direct outbound + founder community referrals."
- What you'll invest in with this capital: "Content + paid + 2 enterprise salespeople."
- Key partnerships or distribution advantages.
- Do NOT show a slide with 8 channels all at equal priority. Show focus.

---
**SLIDE 9 - COMPETITION**
Goal: Show you understand the landscape - and why you win.
- Use a 2×2 matrix or simple table. X axis: one dimension. Y axis: another.
- Position yourself in the top-right (better on both dimensions).
- Name direct competitors. Don't say "there's no competition" - investors know there is.
- Acknowledge what competitors do well. Show where you beat them specifically.

---
**SLIDE 10 - TEAM**
Goal: Show why this team will win.
- For each founder: role, one-line credential, one specific thing they built/led/sold.
- ❌ "Priya has 8 years of experience in finance and consulting."
- ✅ "Priya - CFO, ex-Goldman Sachs, led ₹500 Cr IPO at 28."
- Advisor logos if you have credible ones.
- Hiring plan: "Raising to hire 2 engineers + 1 enterprise sales lead."

---
**SLIDE 11 - FINANCIALS**
- Current MRR/ARR + runway.
- 3-year projection (revenue + EBITDA/loss).
- Keep projections realistic. If Year 3 shows 10x revenue, show the assumptions that drive it.
- Current burn rate and months of runway.

---
**SLIDE 12 - THE ASK**
Make this slide impossible to misread.
- "Raising ₹[X] Cr seed / pre-Series A."
- "At a pre-money valuation of ₹[X] Cr."
- "18 months runway. Milestones: [3 specific milestones]."
- "₹[X] Cr allocated. Looking for ₹[X] Cr more."
- Lead investor status: "Lead secured / seeking lead."

---
**DESIGN NOTES:**
- Font: One heading font (Playfair, Syne, or similar), one body font (Inter, DM Sans).
- Colors: 2–3 max. Dark background works well for financial decks; light background for consumer.
- Every number on a slide should have a source (even if the source is "company data").
- Deck size: Export as PDF. Maximum 10MB. Never send .pptx cold.`,
      },
    ],
  },
  {
    slug: "nda-fundraise",
    title: "Non-Disclosure Agreement (Fundraise)",
    description:
      "A mutual NDA template designed for sharing confidential information with potential investors during fundraising - clean, enforceable, and founder-balanced.",
    price: 19900,
    tag: "legal",
    category: "fundraise",
    comingSoon: false,
    preview: "Mutual NDA template with fundraise-specific carve-outs, practical guidance on when to use it, and a one-page simplified version.",
    sections: [
      {
        heading: "Mutual NDA Template - Full Version",
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
- Your pitch deck - investors see 10–20 decks per week. Requiring an NDA for a deck signals you're inexperienced and will significantly reduce the number who engage with you
- Your high-level one-pager or executive summary
- General product overview without technical specifics

**PRACTICAL REALITY:**
- Most institutional VCs in India will not sign NDAs at the pitch stage - this is standard practice globally, not a red flag
- Angels and family offices are more willing to sign
- For serious investors who've expressed term sheet interest, an NDA for data room access is standard and expected

**DIGITAL-FIRST APPROACH:**
Instead of a paper NDA for data room access, use Google Drive / Notion access control with a click-to-accept NDA embedded in the sharing flow. Services like DocuSign + Notion can automate this.`,
      },
    ],
  },

  // ─── STARTUP - LEGAL & BUSINESS DOCS ────────────────────────────────────────
  {
    slug: "kmp-agreement",
    title: "KMP Agreement",
    description:
      "A Key Managerial Personnel agreement template covering appointment terms, responsibilities, remuneration, confidentiality, and IP assignment for CXO-level hires.",
    price: 19900,
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

*Note: Non-compete enforceability in India is limited under the Indian Contract Act - courts generally only enforce it during the period of employment. Post-employment non-compete must be reasonable in scope, geography, and duration.*

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
      "A comprehensive employment agreement template for full-time hires - covering appointment, compensation, IP assignment, confidentiality, and exit provisions.",
    price: 19900,
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
        heading: "Key Provisions - Annotated",
        body: `**CONFIDENTIALITY**
The Employee shall not disclose any Confidential Information during employment or for [2] years thereafter.

*Annotation: Include a broad definition of confidential information - customer data, financials, product plans, trade secrets. Ensure the clause survives termination.*

**NON-SOLICITATION**
For [12] months post-termination, the Employee shall not:
(a) Recruit or solicit any Company employee
(b) Solicit any customer or prospect the Employee dealt with in the last 12 months of employment

*Annotation: This is generally enforceable in India, unlike blanket non-competes. Keep it targeted - broad non-solicit clauses are challenged in court.*

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
      "A go-to-market plan template for B2B and B2C startups - covering ICP definition, channel strategy, launch sequencing, and a 90-day execution calendar.",
    price: 19900,
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
        body: `**MONTH 1 - FOUNDATION (Days 1–30)**

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
**MONTH 2 - TRACTION (Days 31–60)**

Week 5–6:
☐ Double down on the 1–2 channels showing signal
☐ First 3–5 paying customers (B2B) or 50–100 DAU (B2C)
☐ Build referral loop: ask every customer for 1 intro
☐ Create first content asset based on ICP pain

Week 7–8:
☐ A/B test messaging: 3 variants of your core value prop
☐ CAC/LTV calculation - first data points
☐ Build case study from first customer
☐ Define renewal / retention play

---
**MONTH 3 - SCALE (Days 61–90)**

Week 9–10:
☐ Launch second acquisition channel
☐ First paid campaign (if metrics support it)
☐ Formalize referral program

Week 11–12:
☐ Review unit economics: CAC, LTV, payback period
☐ Double down on what worked; kill what didn't
☐ Prepare GTM retrospective for team + investors`,
      },
      {
        heading: "Filled-In ICP Examples",
        body: `**ICP EXAMPLE 1: B2B SaaS - Compliance automation for Indian SMBs**

Company Size: 50–300 employees
Industry: Manufacturing, textiles, logistics
Geography: Tier 1 + Tier 2 cities (Mumbai, Pune, Surat, Coimbatore)
Buyer Role: HR Manager or Admin Manager
User Role: Same person (HR does both admin and compliance)
Budget Authority: MD/Owner approves; HR recommends
Budget Range: ₹60,000–₹2,40,000/year
Trigger Event: Received a labour inspector notice, OR recently hired 10+ new employees, OR expanding to a new state
Key Pain: "We get surprise compliance notices because we're tracking everything manually in Excel."
Alternative Today: Spreadsheets + CA on retainer for quarterly filing
Biggest Objection: "Is this secure? Who else from our industry uses this?"

**How to reach them:**
- LinkedIn: Target "HR Manager" + "Manufacturing" + city
- Industry associations: FICCI, CII SME chapters host events
- CA referrals: CAs who service 100-employee manufacturers are the best channel - offer a referral fee
- WhatsApp groups: Regional manufacturer WhatsApp communities (exist in every cluster - Surat textiles, Tiruppur garments, Pune auto-components)

**What to say to them:**
"Hi [Name], I saw [Company] recently opened an office in [city]. As you grow headcount, labour compliance across PF, ESI, and labour laws gets complicated fast. We help companies like yours stay audit-ready automatically. Worth a 15-minute call?"

---

**ICP EXAMPLE 2: D2C - Skincare subscription brand targeting urban women**

Demographic: Women, 27–40, Tier 1 cities (Mumbai, Delhi, Bangalore, Hyderabad)
Income: ₹8L–₹25L household income
Psychographic: Health-conscious, research-oriented, willing to pay premium for "clean" or "clinically backed"
Trigger: Recently started paying attention to skin health (post-pandemic), OR dissatisfied with generic drugstore products, OR influenced by a specific skincare creator/community
Key Pain: "I don't know which product is actually right for my skin type - I've wasted money on things that didn't work."
Alternative Today: Nykaa (generic), dermatologist (expensive, infrequent), YouTube research (overwhelming)
Purchase Trigger: Recommendation from a friend, a content creator she follows, or a before/after she finds credible

**How to reach them:**
- Instagram: Influencers in the 10k–200k range (micro-influencers) with engaged beauty/skincare communities - better ROI than large celebrities
- Reddit/communities: r/IndianSkincareAddicts, Facebook groups for skincare in India
- WhatsApp: "Refer a friend" flows once you have happy customers - skincare referrals convert 40% of the time in this demographic
- Content: SEO-driven blogs answering "best serum for [skin type] India" - high purchase intent

**What NOT to do:**
- Generic Instagram ads to women 25–40 - too broad, high CAC
- Discounts as primary acquisition - trains your customer to wait for sales

---

**ICP EXAMPLE 3: B2B Services - Fractional CFO for seed-stage startups**

Company Stage: Seed to pre-Series A (₹1–15 Cr ARR)
Industry: SaaS, fintech, healthtech, D2C
Team Size: 5–25 people
Buyer: Founder/CEO
Trigger Events: (a) Raising a round in the next 6 months, (b) Just raised and need financial structure, (c) Lost track of burn and need clarity
Key Pain: "I don't have a CFO, I can't afford one full-time, but I'm about to sit across from investors who will ask me detailed financial questions I can't answer."
Alternative: Founder does it themselves (badly), or hires a CA who doesn't understand startup finance
Budget: ₹1–3L/month for fractional engagement

**How to reach them:**
- Warm intros through VCs (tell investors you know: "If any of your portfolio companies need fractional CFO support...")
- Startup communities: iSPIRT, LetsVenture, AngelList India
- LinkedIn content: Publish posts on common financial mistakes at the seed stage - founders self-select
- Events: Startup India, TiE events, accelerator demo days - be present where founders are`,
      },
      {
        heading: "India-Specific GTM Channels",
        body: `The channels that work in India are often different from what US startup playbooks describe. Here's a realistic breakdown.

---
**HIGHEST CONVERTING CHANNELS (India B2B)**

**1. Warm founder-to-founder referrals**
Conversion rate: 30–60%. The best GTM motion for early B2B. Founders trust peer recommendations over any marketing. Use LinkedIn to map which founders are 2 degrees away from your ICP. Ask for introductions specifically.

**2. WhatsApp communities**
India has active WhatsApp groups for almost every professional community - D2C founders, fintech CTOs, HR managers in manufacturing, CFOs of mid-size companies. Getting into the right group and providing value (not pitching) is more powerful than any paid channel at the seed stage. How to find them: ask customers which groups they're in.

**3. CA / Accountant partnerships**
Chartered Accountants are trusted advisors to Indian SMBs and often have ongoing relationships with 50–200 client companies. For finance, compliance, or business software, a CA referral partnership converts at 2–3x the rate of direct outbound. Offer them a 10–20% referral fee or a branded version of your product.

**4. Industry association events**
CII, FICCI, NASSCOM, YourStory events are attended by the decision-makers at your ICP. Sponsoring or speaking at one event can generate more qualified leads than 3 months of paid ads.

**5. LinkedIn content (founder-led)**
Indian founder audiences respond to personal, honest, behind-the-scenes content. "Here's what we got wrong in our first 6 months" outperforms "Our product does X, Y, Z." Build the founder's audience before the product audience.

---
**B2C CHANNELS THAT WORK IN INDIA**

**Micro-influencers (10k–200k followers):** 5–10x better ROI than celebrity influencers for product categories requiring trust (health, finance, parenting). The audience is engaged and more willing to try something recommended by someone who "gets it."

**Regional content creators:** Creators in Hindi, Tamil, Telugu, Kannada reach audiences that English content misses. For any product targeting non-metro India, vernacular content is underused and underleveraged.

**WhatsApp forwards:** Indian consumers share product recommendations via WhatsApp before any other platform. Design your product experience and packaging to be "WhatsApp-forward worthy" - this is organic virality for D2C.

**UPI-linked loyalty / cashback:** Price-sensitive segments in India respond disproportionately to cashback vs. discounts. A ₹50 cashback on ₹500 converts better than 10% off because cashback is perceived as "free money."

---
**CHANNELS TO AVOID AT EARLY STAGE**

- **Google Search ads (broad):** Expensive and competitive unless you have a very specific high-intent keyword. Start with SEO, not paid search.
- **TV / OOH:** Only makes sense at ₹5+ Cr marketing budget.
- **Influencer gifting without a clear conversion mechanism:** Sending free product and hoping for posts is not a channel - it's wishful thinking.
- **"Viral" campaigns without existing audience:** You can't manufacture virality. Build an audience through consistent content, then engineer moments.`,
      },
    ],
  },
  {
    slug: "startup-idea-analysis",
    title: "Startup Idea Analysis",
    description:
      "A structured framework for analysing a startup idea before committing to it - covering problem validation, market sizing, competitive moat, and founder-market fit.",
    price: 19900,
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
"I'm researching [problem space]. I want to understand how people like you currently [do the thing]. I'm not selling anything - I'd love to learn from your experience."

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
      {
        heading: "Go/No-Go Decision Matrix & Common Failure Modes",
        body: `**GO/NO-GO DECISION MATRIX**

After completing your 7-dimension scoring and your 20 validation interviews, run this final check.

**GREEN FLAGS - strong signals to proceed:**
☐ At least 15/20 interview subjects confirmed the same core pain without prompting
☐ At least 3 people offered to pay / sign up / introduce you to someone who would buy
☐ You found a workaround people currently use (spreadsheet, manual process, duct-tape solution) - this proves the problem is real
☐ The problem is recurring (not one-time) - monthly, weekly, or daily
☐ The people experiencing the problem have budget authority or can influence someone who does
☐ Your average idea score is 3.5+ with no single dimension below 2

**YELLOW FLAGS - proceed with caution, address these before building:**
☐ People say "it's a problem" but haven't tried to solve it yet (pain may not be severe enough)
☐ The person you'd sell to isn't the person experiencing the pain (long sales cycle risk)
☐ You have strong founder-market fit but the market size is borderline (< ₹500 Cr TAM)
☐ The problem exists but only for a very specific sub-segment you haven't fully defined
☐ Regulatory risk: your model depends on something that could be regulated or banned

**RED FLAGS - stop, rethink, or pivot:**
☐ Fewer than 10/20 interviews confirmed the problem
☐ Nobody has tried to solve it - "it's annoying but not worth fixing"
☐ The person who feels the pain has no budget or influence over purchasing
☐ The problem can be solved by a ₹0 workaround (Excel formula, free tool, one extra person)
☐ A well-funded competitor already has this market (unless you have clear differentiation)
☐ Your only unfair advantage is "we'll work harder"

---
**COMMON IDEA FAILURE MODES IN INDIA**

**Failure mode 1: Solving for yourself, not the market**
The idea comes from your own frustration, but your profile isn't your customer. Founders with corporate backgrounds often build for corporate customers. The market may be SMBs who are different in every dimension. Validate that your personal pain matches your market's pain.

**Failure mode 2: "Everyone needs this" thinking**
If your target customer is "all businesses" or "anyone with a phone," you have no target customer. Start with the 100 most specific people who would buy this. If you can't name 100 companies or people, your ICP is too broad.

**Failure mode 3: Building the solution before validating willingness to pay**
In India, people are especially willing to say "yes, I want this" but not commit money. The only valid proof of demand is payment, not enthusiasm. Get a ₹500–₹5,000 commitment (refundable) before building.

**Failure mode 4: Underestimating distribution**
A great product with no distribution path fails. Before building, answer: "How will the first 100 customers find us?" If the answer is "we'll figure it out," that's a red flag. Distribution must be as specific as the product.

**Failure mode 5: India-specific - the "free is expected" problem**
In some markets (SMBs, consumer), there's cultural resistance to paying for software. If your target customer currently uses WhatsApp or a free tool to solve the problem, they may resist paying. Test willingness to pay early and aggressively.

**Failure mode 6: Regulation dependency**
Fintech, healthtech, and edtech in India are heavily regulated. If your business model depends on regulatory grey areas, build contingency plans. The government has reversed course on multiple startup-friendly regulatory positions in the last 5 years.`,
      },
    ],
  },
  {
    slug: "market-positioning",
    title: "Market Positioning",
    description:
      "A positioning framework for early-stage startups - covering category creation, competitive positioning, and how to write a positioning statement that sticks.",
    price: 19900,
    tag: "framework",
    category: "startup",
    comingSoon: false,
    preview: "April Dunford's positioning framework adapted for Indian startups, with before/after examples and a competitive positioning map template.",
    sections: [
      {
        heading: "Positioning Framework",
        body: `**THE 5 COMPONENTS OF POSITIONING (adapted from April Dunford):**

1. **Competitive Alternatives** - What do customers do if your product doesn't exist?
   Not your direct competitors. The status quo. Spreadsheets. WhatsApp. Doing nothing.
   *Your product competes against the alternative, not just other startups.*

2. **Unique Attributes** - What do you have that alternatives don't?
   Features, data, integrations, team, relationships, speed.
   Be specific. "Better UX" is not an attribute.

3. **Value** - What does each attribute enable for the customer?
   Translate each attribute into a concrete business outcome.
   Attribute: "Real-time bank data" → Value: "Finance team closes books in 2 days, not 10"

4. **Customer Segments** - Who cares most about that value?
   Not everyone. The specific segment where your value is most valuable.

5. **Market Category** - What are you?
   The frame the customer uses to understand what you do and who you compete with.
   You choose this. Choose carefully - the category determines what you're compared to.

---
**POSITIONING STATEMENT TEMPLATE:**
For [Target Customer] who [have this need / problem], [Company] is a [market category] that [key benefit]. Unlike [competitive alternatives], we [key differentiator].

**Example:**
For D2C brands doing ₹1–10 Cr monthly revenue who struggle with reconciling payments across Razorpay, Shopify, and bank accounts, Finly is a financial operations platform that automates reconciliation in real-time. Unlike manual spreadsheets or generic accounting software, Finly is built for D2C payment complexity.`,
      },
      {
        heading: "Competitive Positioning Map & Messaging Hierarchy",
        body: `**COMPETITIVE POSITIONING MAP**

A positioning map shows where you and competitors sit relative to each other. Pick two axes that matter most to your customer - not "price vs. quality" (too generic) but specific to your category.

**How to build yours:**
Step 1: List your top 3 alternatives (including "status quo" as a competitor).
Step 2: Identify the 2 dimensions your ICP cares most about. These come from customer interviews - what do they compare options on?
Step 3: Plot all options honestly on the 2×2.

**Example: B2B Invoice Management (India)**
Axes: Ease of setup (Y) vs. Level of automation (X)

- Manual/Excel: Low automation, high ease → bottom-left
- Tally + plugin: Medium automation, medium ease → middle
- SAP/Oracle: High automation, low ease → bottom-right
- You (purpose-built SaaS): High automation, high ease → top-right ✅

**The top-right quadrant is where you want to be.** If competitors cluster in that space, you haven't differentiated - reconsider your axes until you find dimensions where you genuinely lead.

---
**MESSAGING HIERARCHY**

Positioning → Value Propositions → Headlines → Taglines

These are different. Most founders confuse them.

**Positioning** (internal, strategic): "For D2C finance teams who spend 4 days/month on reconciliation, Finly is a financial operations platform that automates it in real-time. Unlike spreadsheets and generic accounting software, Finly is built for D2C payment complexity."

**Value Propositions** (customer-facing, benefit-first): 3 specific outcomes your product delivers.
1. "Close your books in 2 days, not 10."
2. "Catch invoice discrepancies before they hit the books."
3. "Connect Razorpay, Shopify, and your bank in one click."

**Headlines** (for landing page, ads, sales collateral): Crisp, testable, 8 words or fewer.
- "Reconciliation for D2C brands. Automated."
- "From 10 days to 2. Finly closes your books."
- "Stop chasing invoices. Start closing deals."

**Tagline** (brand identity, 3–6 words): Memorable, not clever.
- "Finance built for D2C."
- Not: "Empowering brands through financial clarity." (too vague, means nothing)

**The test for each level:** Can you explain what you do to your ICP in the time it takes? If your positioning takes 5 minutes, it's not done. If your headline takes 30 seconds to parse, rewrite it.`,
      },
      {
        heading: "How to Test Your Positioning & Common Pivots",
        body: `**TESTING YOUR POSITIONING**

Positioning is a hypothesis until tested. Here's how to test it without spending money:

**Test 1: The 5-second test**
Show your landing page headline to 5 people outside your company for 5 seconds. Ask: "What does this company do? Who is it for?" If they can't answer, your headline isn't working.

**Test 2: The customer mirror test**
In your next 5 customer calls, describe your product using your new positioning. Listen for: Do they nod and say "yes, exactly"? Or do they look confused? Confusion = wrong positioning.

**Test 3: The referral test**
Ask a happy customer: "If you were introducing us to a peer, how would you describe us?" Their words are your best positioning. What they say is how real customers think about you - which matters more than how you think about yourself.

**Test 4: The competitor test**
Send your positioning statement to someone in your network who follows your space. Ask: "Does this sound different from [Competitor A] and [Competitor B]?" If they say "not really," you've not differentiated enough.

---
**COMMON POSITIONING PIVOTS**

These are real scenarios where Indian startups successfully repositioned:

**1. Segment pivot:** Started selling to all SMBs → repositioned to only D2C brands.
Why it worked: Same product, but D2C brands had a more specific, urgent pain and could articulate the value to peers. CAC dropped 60%.

**2. Category pivot:** Launched as "AI chatbot for customer support" → repositioned to "first-response automation for e-commerce."
Why it worked: "AI chatbot" is a crowded, commodity-sounding category. "First-response automation for e-commerce" is a specific category with a clear buyer and a measurable outcome.

**3. Problem pivot:** Started positioning around "saves time" → repositioned to "prevents revenue leakage."
Why it worked: CFOs don't buy time savings. They buy cost reduction and loss prevention. Same product, different value frame, 2x conversion rate on demos.

**4. Competitive alternative pivot:** Positioned against other software → repositioned against manual Excel.
Why it worked: Most Indian SMBs weren't using any software - they were using spreadsheets. Competing against Excel is easier and more resonant than competing against established SaaS.

---
**When to reposition:**
- Your conversion rate on demos is below 20%
- Customers are confused about what category you're in
- You keep losing to "we'll stick with Excel" - and you're not addressing that directly
- Your best customers use totally different words to describe your product than you do`,
      },
    ],
  },
  {
    slug: "value-proposition",
    title: "Value Proposition",
    description:
      "A value proposition design workbook - from customer jobs-to-be-done to a crisp one-liner that converts, with templates for B2B and B2C contexts.",
    price: 19900,
    tag: "framework",
    category: "startup",
    comingSoon: false,
    preview: "Jobs-to-be-done canvas, gain/pain mapping, value proposition canvas, and a formula for writing a one-liner that resonates.",
    sections: [
      {
        heading: "Jobs-to-Be-Done & Value Proposition Canvas",
        body: `**CUSTOMER PROFILE - JOBS TO BE DONE:**

For your target customer, identify three types of jobs:

1. **Functional Jobs** - Practical tasks they're trying to accomplish
   Example: "Manage my team's expense claims without chasing receipts"

2. **Social Jobs** - How they want to be perceived by others
   Example: "Be seen as a financially rigorous founder who investors trust"

3. **Emotional Jobs** - How they want to feel
   Example: "Feel in control of my company's finances, not anxious about month-end"

---
**GAIN/PAIN MAP:**

*Customer Pains (ranked by severity):*
1. [Most severe pain - causes significant loss or frustration]
2. [Moderate pain - regular friction]
3. [Minor pain - inconvenience]

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
      {
        heading: "Filled-In Examples: B2B SaaS & D2C",
        body: `**EXAMPLE 1: B2B SaaS - HR Compliance Tool for Indian SMBs**

**Customer Profile:**
- Who: HR managers at Indian manufacturing companies with 100–500 employees
- Functional Job: "Ensure we're PF, ESI, and labour law compliant without hiring a full-time legal team."
- Social Job: "Be seen by the MD as someone who keeps the company out of trouble."
- Emotional Job: "Stop feeling anxious every time an inspector arrives."

**Pains (ranked):**
1. Severe: An unexpected labour inspector visit caught them non-compliant - ₹5L fine last year.
2. Moderate: Manual tracking of PF contributions across 3 offices - spreadsheet errors every quarter.
3. Minor: Can't generate compliance reports quickly for auditors - takes 3 days of manual work.

**Gains (ranked):**
1. Most desired: "Be audit-ready at any time, with zero preparation."
2. Expected: "File PF and ESI on time, every month, automatically."
3. Unexpected delight: "Know which employees are approaching gratuity eligibility before it becomes a liability surprise."

**Value Proposition Canvas:**
Pain Relievers:
- Fine risk → automated compliance calendar with pre-filing alerts, 30 days before due date
- Spreadsheet errors → single source of truth auto-synced with EPFO/ESIC portals

Gain Creators:
- Audit-ready → one-click compliance report in PDF, formatted for government standards
- Gratuity surprises → 12-month liability forecast dashboard

**One-Liner:**
"We help HR managers at Indian manufacturing companies stay labour law compliant automatically - so they never get caught off-guard by an inspector or an audit again."

---

**EXAMPLE 2: D2C - Personalised Nutrition Subscription**

**Customer Profile:**
- Who: Urban Indian women, 28–40, spending ₹3,000–10,000/month on health and wellness
- Functional Job: "Get vitamins and supplements that actually work for my specific body, not generic ones."
- Social Job: "Be someone who takes their health seriously - someone who has a 'routine.'"
- Emotional Job: "Feel like I'm making progress on my health, not just spending money and hoping."

**Pains (ranked):**
1. Severe: Bought 4 different supplement brands last year - can't remember what they're for, don't know if they work.
2. Moderate: Confused by labels - don't know which form of iron to take (ferrous sulfate vs. bisglycinate).
3. Minor: Generic multivitamins don't account for her vegetarian diet and vitamin D deficiency.

**Gains (ranked):**
1. Most desired: "Know exactly what I should be taking and why, in plain language."
2. Expected: "One monthly box. No thinking required. Arrives before I run out."
3. Unexpected delight: "My skin improved - something I wasn't expecting."

**Value Proposition Canvas:**
Pain Relievers:
- Confusion → 5-minute quiz + nutritionist review → personalised stack, explained in plain English
- "Don't know if it's working" → quarterly check-in and stack adjustment based on reported outcomes

Gain Creators:
- Clear outcomes → monthly progress tracker ("Here's what changed this month")
- Subscription convenience → auto-renewal, pause anytime, WhatsApp support

**One-Liner:**
"We help urban Indian women get a personalised supplement routine built by nutritionists - delivered monthly, adjusted quarterly, explained in plain language."`,
      },
      {
        heading: "Testing Your Value Proposition",
        body: `Most founders write a value proposition and never test it. Here are 4 ways to test yours in under a week.

---
**Test 1: The Landing Page Conversion Test**
Create a simple landing page (use Framer, Carrd, or Webflow - takes 2 hours) with:
- Your headline (the value prop, 8 words or fewer)
- 3 bullet benefits
- One CTA: "Get early access" or "Book a call"

Drive 200 visitors (LinkedIn post, community share, or ₹2,000 in ads). If conversion rate (CTA clicks / visitors) is below 3%, your value prop isn't resonating. A/B test the headline.

---
**Test 2: The Sales Call Opening Test**
In your next 10 discovery calls, open with your value proposition - stated exactly as you've written it: "We help [WHO] [DO WHAT] [SO THAT OUTCOME]."

Watch the reaction in the first 5 seconds:
- Leaning forward, nodding, "yes, that's us" = strong resonance
- Polite but blank look = wrong segment or wrong pain
- "We don't really have that problem" = wrong ICP

Change the opening based on reactions. The version that generates the most "yes, exactly" responses in 10 calls is your current best VP.

---
**Test 3: The Referral Words Test**
Ask 5 happy customers: "If you were introducing us to a peer, what would you say?"

Record their exact words. The overlap between what 3+ customers say is your actual value proposition - more accurate than anything you'd write yourself.

If their words don't match yours at all, your VP is wrong. Rewrite it in their language.

---
**Test 4: The Ad Copy Test**
Run two LinkedIn/Meta ads to the same audience for ₹3,000 each. Same image, different headline:
- Ad A: Your current value prop headline
- Ad B: An alternative framing

Measure: click-through rate (not impressions, not reach - CTR). Higher CTR = stronger resonance with that audience.

This works best once you have 500+ target customers identifiable by job title and industry on LinkedIn.

---
**Common VP failure modes:**
- **Too feature-focused:** "AI-powered invoice matching" → nobody buys features. Translate: "Catch invoice discrepancies before they hit the books."
- **Too vague:** "Better finance for growing companies." → means nothing. To whom? Better how? What kind of finance?
- **Too large a segment:** "For all businesses." → Nobody feels spoken to. Narrow until it feels too narrow, then stop.
- **Wrong jobs:** You're solving a social or emotional job but describing a functional one. (e.g., your customer wants to feel in control - but you're selling "efficiency.")`,
      },
    ],
  },
  {
    slug: "employee-offer-letter",
    title: "Employee Offer Letter Template",
    description:
      "A clean, professional offer letter template for full-time hires - with ESOP clause variant, joining bonus variant, and guidance on offer letter best practices.",
    price: 19900,
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
      {
        heading: "ESOP Offer Letter Variant",
        body: `Use this variant when ESOP is a meaningful part of the compensation - typically for founding hires (hire #1–10) where you're asking the candidate to take a below-market cash salary in exchange for equity upside.

---
**[COMPANY LETTERHEAD]**

[DATE]

Dear [NAME],

We are pleased to offer you the position of **[ROLE]** at [COMPANY NAME] effective [START DATE].

**COMPENSATION:**

| Component | Annual (₹) |
|---|---|
| Fixed CTC | [X] |
| Variable (if applicable) | [X] |
| **Total Cash CTC** | **[X]** |

**ESOP GRANT:**
Subject to approval by the Board and execution of our ESOP Plan documentation, we are granting you **[X] stock options** under the [COMPANY NAME] Employee Stock Option Plan.

Key terms of your ESOP grant:
- **Grant size:** [X] options (representing [X]% of the company on a fully diluted basis as of [DATE])
- **Vesting schedule:** 4-year vest with a 1-year cliff from your Start Date
  - Cliff: [X] options vest on [DATE - 1 year from start]
  - Monthly: [X] options vest per month for the following 36 months
- **Exercise price:** ₹[X] per option (current fair market value as determined by the Board)
- **Exercise window:** Options must be exercised within [2] years of vesting or termination (whichever is earlier)
- **Acceleration:** Upon a change of control (acquisition / IPO), [50% / 100%] of your unvested options will accelerate

**ESOP context (plain English):**
As of today, the company is valued at approximately ₹[X] Cr. Your [X] options represent [X]% of the company. At a ₹[Y] Cr exit, those options would be worth approximately ₹[Z], before tax. I'd encourage you to value these at zero for your personal financial planning - the upside is real, but it is uncertain and long-dated.

---
*All other terms as per the Standard Offer Letter above.*

---
**How to have the ESOP conversation with candidates:**

Most candidates don't understand ESOP. Here's how to explain it in 2 minutes:

"We're granting you [X] options. Think of each option as the right to buy one share of the company at ₹[X] - which is today's value. If the company grows to be worth 10x, your shares are worth 10x too. The vesting means you earn these over 4 years - you get 25% after 1 year, then monthly after that. If you leave before 1 year, you get nothing. After 4 years, you've earned everything.

The honest answer on what it's worth: I don't know. At our current valuation of ₹[X] Cr, your stake is worth ₹[Y] on paper. But ESOP value is only realised on an exit - IPO or acquisition. That's hopefully 5–7 years from now. So please don't factor it into your monthly budget."`,
      },
      {
        heading: "Joining Bonus Variant & Counter-Offer Handling",
        body: `**JOINING BONUS VARIANT**

Use a joining bonus when:
1. The candidate has unvested ESOP at their current employer (you're asking them to leave money on the table)
2. They have a significant notice period and you want to incentivise a faster start
3. The cash offer is below market and you want to bridge a gap without inflating base salary

**Joining Bonus Clause (add to standard offer letter):**
"As part of your compensation, you will receive a joining bonus of ₹[X], payable with your first month's salary. This joining bonus is subject to a 12-month retention clause - if you leave the company within 12 months of joining for reasons other than termination without cause, you agree to repay [100% / 50%] of the joining bonus."

**Common joining bonus amounts by seniority:**
- Junior hires (0–3 yrs): ₹25,000–₹1,00,000
- Mid-level (3–6 yrs): ₹1,00,000–₹3,00,000
- Senior / C-suite: ₹3,00,000–₹10,00,000+
- To replace unvested ESOP at current employer: calculate their unvested value and match 50–75%

---
**HANDLING COUNTER-OFFERS**

Counter-offers are common and will happen. Here's how to handle each scenario:

**Scenario 1: They tell you upfront they're expecting a counter-offer**
"I appreciate you telling me. Let me be direct - we've made this offer because we genuinely believe you're the right person for this role, not to win a bidding war. If your current company counter-offers, I'd encourage you to ask yourself: why are they offering now and not before? Here's our position: [your best offer, stated clearly]. I'd like an answer by [date]."

**Scenario 2: They come back with a competing offer after accepting yours**
"I understand - that's a significant offer. Our position stands as is. If you're genuinely undecided, I'd encourage you to think beyond the number: what's the growth opportunity, the team you'll work with, the kind of problems you'll solve? We'd love to have you. Let me know by [date]."

**Scenario 3: They ask for more after you've already stretched**
"We've moved as far as we can on [cash / ESOP / title]. What I can offer instead is [specific alternative: flexible working, accelerated review at 6 months, additional ESOP tranche if milestone hit]. If the number is the deciding factor and we can't bridge it, I understand - but I want to make sure we've explored all the options first."

**What never to do:**
- Don't make an offer and then immediately negotiate against yourself
- Don't match a counter-offer that's clearly inflated just to close - you'll create resentment when the next raise cycle comes
- Don't give "unlimited time to decide" - give a clear deadline (3–5 business days) and stick to it

**The 48-hour rule:**
Send the offer letter, then follow up with a call 48 hours later. "I wanted to make sure you had a chance to review it. Do you have any questions?" This catches hesitation early and gives you a chance to address it before they accept a competing offer.`,
      },
    ],
  },
  {
    slug: "founders-agreement",
    title: "Founders Agreement",
    description:
      "A comprehensive founders' agreement template covering equity split, vesting, roles, decision-making, IP assignment, and exit provisions - the most important document you'll sign before your first investor.",
    price: 19900,
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
[3. [FOUNDER 3 NAME] ("Founder 3")] - if applicable

(collectively, the "Founders")

for and on behalf of **[COMPANY NAME]** (to be incorporated or recently incorporated)

---
**ARTICLE 1 - EQUITY SPLIT**

1.1 The Founders agree to the following initial equity allocation:
| Founder | Initial % | Role |
|---|---|---|
| Founder 1 | [X]% | CEO |
| Founder 2 | [X]% | CTO |
| [Founder 3] | [X]% | [Role] |
| **ESOP Pool** | **[X]%** | - |
| **Total** | **100%** | |

1.2 This allocation is subject to the vesting schedule set out in Article 2.

1.3 The Founders acknowledge that this split reflects contributions to date (idea, initial capital, technical IP, customer relationships) as documented in Schedule 1.

**ARTICLE 2 - VESTING**

2.1 All Founder shares shall vest over 4 years with a 1-year cliff from the Incorporation Date.
2.2 Cliff: 25% of allocated shares vest on the first anniversary of the Incorporation Date.
2.3 Monthly vest: The remaining 75% vest equally over the following 36 months.
2.4 Acceleration: Upon an Exit Event, [50% / 100%] of unvested shares shall accelerate.

**ARTICLE 3 - ROLES & DECISION-MAKING**

3.1 Roles:
- Founder 1 shall serve as CEO, responsible for [commercial, fundraising, and company strategy]
- Founder 2 shall serve as CTO, responsible for [product, engineering, and technology]

3.2 Day-to-day decisions (< ₹[X]): any Founder acting alone
3.3 Material decisions (₹[X] – ₹[X], new hires above ₹[X] CTC): majority Founder approval
3.4 Reserved decisions (equity issuance, exit, change of business): unanimous Founder approval`,
      },
      {
        heading: "IP Assignment, Exit Provisions & Pre-Discussion Checklist",
        body: `**ARTICLE 4 - IP ASSIGNMENT**
All intellectual property, code, designs, trade secrets, and inventions created by any Founder - whether before or after incorporation, and related to the Company's business - are hereby assigned to the Company.

The Founders agree to execute any additional documents required to perfect this assignment.

**ARTICLE 5 - CONFIDENTIALITY**
During the term and for [3] years after any Founder's departure, all Founders agree to maintain strict confidentiality of Company information.

**ARTICLE 6 - LEAVER PROVISIONS**

6.1 Good Leaver: Departure due to death, disability, or termination without cause.
- Unvested shares are bought back at Fair Market Value (determined by independent valuation)
- Vested shares retained in full

6.2 Bad Leaver: Voluntary resignation or termination for cause within [3] years.
- Unvested shares are bought back at face value (₹10 per share)
- Vested shares retained, but subject to ROFR at fair market value

**ARTICLE 7 - DISPUTE RESOLUTION**
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
☐ What's the vision for the company - lifestyle business or venture-scale?
☐ Under what conditions would you be open to selling the company?`,
      },
    ],
  },
  {
    slug: "nda-startup",
    title: "Non-Disclosure Agreement (Startup Operations)",
    description:
      "NDA templates for startup operations - covering employee NDA, vendor/contractor NDA, and customer NDA, with guidance on when to use each.",
    price: 19900,
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

  {
    slug: "investor-update-email",
    title: "Investor Update Email Templates",
    description: "Monthly and quarterly investor update templates that keep your investors informed, engaged, and ready to help - without taking hours to write.",
    price: 19900,
    tag: "templates",
    category: "fundraise",
    comingSoon: false,
    preview: "4 investor update templates (monthly, quarterly, tough-month, and milestone) with fill-in-the-blank structure and notes on what investors actually want to see.",
    sections: [
      {
        heading: "Why investor updates matter",
        body: `Most founders send investor updates only when things are going well. This is backwards.

Investors who receive regular, honest updates are more likely to:
- Introduce you to other investors when you need them
- Help you solve problems before they become crises
- Give you the benefit of the doubt when you miss a target

The founders who are hardest to back in a future round are the ones who went silent for 8 months and only surfaced when they needed money.

These templates are designed to take you 30 minutes or less per update. The structure is fixed - you fill in the numbers and the narrative.`,
      },
      {
        heading: "Template 1 - Monthly Update (Standard)",
        body: `**Subject:** [Company] - [Month] update

Hi [investor first names],

Here's our [Month] update.

**The number that matters most this month:** [MRR / ARR / active users / whichever metric you're optimising for]

**Month summary in one sentence:** [e.g. "Crossed ₹10L MRR for the first time, but churn picked up in the SMB segment - investigating why."]

---

**Metrics**
- MRR: ₹[X] ([+/–X%] vs last month)
- Active customers: [X]
- New customers this month: [X]
- Churned customers: [X]
- Runway at current burn: [X months]

**What went well**
- [1–3 bullet points - be specific]

**What didn't go well / what we're working on**
- [1–3 bullet points - be honest, include what you're doing about it]

**Focus for next month**
- [1–3 items you're prioritising]

**Where you can help**
- [Specific ask - intro to X, advice on Y, connection to Z]

[Your name]

---
**Notes on tone:** Direct, honest, short. Investors read dozens of updates. The ones that stand out are specific about what's working AND what isn't. Generic positivity is the fastest way to get your updates skipped.`,
      },
      {
        heading: "Template 2 - Quarterly Update (More detailed)",
        body: `**Subject:** [Company] Q[X] [Year] - investor update

Hi [investor first names],

Q[X] update below. Happy to jump on a call if anything here warrants discussion.

**Quarter in one paragraph:**
[3–5 sentences on the shape of the quarter - what you set out to do, what you achieved, and where you're heading next quarter.]

---

**Key metrics - Q[X] vs Q[X-1]**

| Metric | Q[X-1] | Q[X] | Change |
|---|---|---|---|
| MRR / ARR | ₹X | ₹X | +X% |
| Active customers | X | X | +X% |
| Gross margin | X% | X% | - |
| Burn rate (monthly) | ₹X | ₹X | - |
| Runway | X months | X months | - |

**Milestones reached this quarter**
- [List 2–4 specific milestones]

**Milestones missed - and why**
- [Be honest. Include what you learned and what you're changing.]

**Key hires / team changes**
- [Any hires, departures, or org changes]

**Product highlights**
- [2–3 key things shipped or in progress]

**Next quarter priorities (top 3)**
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

**Asks**
- [Specific introductions or help needed]

[Your name]`,
      },
      {
        heading: "Template 3 - Tough Month Update",
        body: `**Subject:** [Company] - [Month] update (honest version)

Hi [investor first names],

This month was harder than expected. I want to be straight with you about what happened.

**What happened:**
[2–3 sentences. Be specific. Don't hedge with "macro headwinds" unless that's genuinely the cause.]

**The numbers:**
- MRR: ₹[X] (was ₹[X] last month - [–X%])
- Key metric: [X]
- Runway: [X months at current burn]

**What we're doing about it:**
[Specific actions - not "we're working hard on it." What specifically changed? What's the hypothesis? What are you testing?]

**What I need from you:**
[Be direct. An intro? A sounding board call? A specific connection? Investors respect directness far more than silence.]

I'll send another update in [2 weeks / next month] with a status on the above.

[Your name]

---
**Why this template works:** Investors have seen companies fail. What they can't forgive is being surprised at the end. A transparent tough-month update builds more trust than six months of rosy updates followed by a crisis call.`,
      },
      {
        heading: "Template 4 - Milestone / Announcement Update",
        body: `**Subject:** [Company] - [milestone achieved]

Hi [investor first names],

Quick update - wanted to share this directly.

**The news:**
[One sentence. Be direct: "We closed ₹X crore from [investor]", "We crossed ₹1Cr ARR today", "We signed [company] as our first enterprise customer."]

**What this means for us:**
[2–3 sentences on why this milestone matters for the company's trajectory.]

**What's next:**
[1–2 sentences on what you're focused on now that this is done.]

**Where you can still help:**
[Optional, but appreciated - keeps the relationship active even when things are going well.]

Thanks for being on this journey.

[Your name]`,
      },
    ],
  },

  {
    slug: "cap-table-template",
    title: "Cap Table Template & Guide",
    description: "A plain-language cap table template with worked examples - pre-seed through Series A - plus a guide to understanding dilution, option pools, and pro-rata rights.",
    price: 19900,
    tag: "templates",
    category: "fundraise",
    comingSoon: false,
    preview: "Downloadable cap table structure with pre-seed, seed, and Series A scenarios - plus a founder's guide to reading and managing your cap table.",
    sections: [
      {
        heading: "What a cap table is and why it matters",
        body: `A cap table (capitalisation table) is a record of who owns what in your company - every shareholder, the number and type of shares they hold, and the percentage of the company each holding represents.

It matters because:
- Every funding round changes it, usually by diluting existing shareholders
- Investors will scrutinise it before investing - a messy cap table is a red flag
- Your future payout in any exit scenario is determined by your cap table and the rights attached to each share class
- The option pool you create for employees comes out of the cap table (usually from the founder's share before a round - understand this before you agree to it)

**The earlier you manage your cap table carefully, the better your options later.**`,
      },
      {
        heading: "Pre-seed cap table - worked example",
        body: `**Scenario:** Two co-founders, incorporating before the first raise.

**Shares issued at incorporation:**

| Shareholder | Shares | % Ownership | Share class |
|---|---|---|---|
| Founder 1 | 5,000,000 | 50% | Equity |
| Founder 2 | 5,000,000 | 50% | Equity |
| **Total** | **10,000,000** | **100%** | |

**Key decisions at incorporation:**
- Issue enough shares to allow for future splitting without fractions (10M is standard)
- Both founders should be on a vesting schedule - even if you trust each other, this protects both parties if one leaves
- Standard vesting: 4-year vesting with a 1-year cliff (nothing vests in year 1, then 25% on the cliff date, then monthly over years 2–4)

**After a pre-seed round (₹1Cr at ₹4Cr post-money valuation = 25% dilution):**

| Shareholder | Shares | % Ownership |
|---|---|---|
| Founder 1 | 5,000,000 | 37.5% |
| Founder 2 | 5,000,000 | 37.5% |
| Angel investors (CCPS) | 3,333,333 | 25% |
| **Total (fully diluted)** | **13,333,333** | **100%** |

Note: the new shares are calculated as: (25% × total post-round shares) = 3,333,333. The founders' absolute share count doesn't change - their percentage drops because more shares are in circulation.`,
      },
      {
        heading: "Seed round - option pool and dilution",
        body: `**Scenario:** Pre-seed closed. Now raising a ₹3Cr seed at ₹12Cr post-money (25% dilution again). Investor requires a 10% ESOP pool to be created before the round.

**Why the option pool matters:**
The "option pool shuffle" is one of the most misunderstood parts of early fundraising. When an investor asks for a 10% option pool "pre-money," they mean 10% of the post-round fully diluted shares - created by diluting the existing shareholders before the new money comes in.

This means the effective pre-money valuation is lower than it appears.

**Before seed round (post ESOP creation):**

| Shareholder | Shares | % |
|---|---|---|
| Founder 1 | 5,000,000 | 33.75% |
| Founder 2 | 5,000,000 | 33.75% |
| Pre-seed angels | 3,333,333 | 22.5% |
| ESOP pool (unissued) | 1,481,481 | 10% |
| **Total** | **14,814,814** | **100%** |

**After seed round:**

| Shareholder | Shares | % |
|---|---|---|
| Founder 1 | 5,000,000 | 25.3% |
| Founder 2 | 5,000,000 | 25.3% |
| Pre-seed angels | 3,333,333 | 16.9% |
| ESOP pool | 1,481,481 | 7.5% |
| Seed investors (CCPS) | 4,938,271 | 25% |
| **Total** | **19,752,085** | **100%** |

**Key point:** after two 25% dilution rounds plus a 10% option pool, the founders each own ~25% of their company. This is normal and healthy for this stage - but many founders are surprised by how quickly dilution compounds.`,
      },
      {
        heading: "Reading your cap table: key terms",
        body: `**Fully diluted shares:** The total share count including all issued shares, all unissued ESOP options, and all convertible instruments (SAFE, CCPS) as if fully converted. This is the number that matters for ownership percentage calculations.

**Authorised vs issued shares:** Authorised shares are the maximum you can issue (defined in your Articles of Association). Issued shares are what's actually been given to shareholders. Always authorise more than you've issued - you need headroom for future rounds.

**Liquidation preference:** Most preferred shares (CCPS) carry a liquidation preference - in an exit, investors get paid back their investment (1x non-participating) before founders get anything. In a low-exit scenario, this can mean founders receive nothing. Understand what preference stack you're agreeing to.

**Pro-rata rights:** The right for existing investors to invest in future rounds to maintain their ownership percentage. Standard at seed. Know who has these rights and for how long.

**Anti-dilution:** Protects investors if you raise at a lower valuation in future. Broad-based weighted average (standard) is much better for founders than full ratchet (avoid).

**Drag-along rights:** Allows majority shareholders to force minority shareholders to agree to a sale. Common in investor agreements - make sure the threshold is set appropriately (typically 75%+ approval required).`,
      },
      {
        heading: "Cap table hygiene - what to do",
        body: `**Before you incorporate:**
- Decide the founder split carefully - changing it later is possible but creates friction
- Agree on vesting schedules in writing, even between co-founders
- Issue enough shares to allow for future rounds without inconvenient fractions

**After each funding round:**
- Update the cap table immediately - don't let it go stale
- Confirm the fully diluted share count with your lawyer
- Update your ESOP register alongside the cap table

**Before the next raise:**
- Have a lawyer review the cap table for any issues before you start investor conversations
- Know your fully diluted post-money ownership at different dilution scenarios - don't be surprised in negotiations
- Understand every preference, right, and restriction attached to every share class

**Tools to manage your cap table:**
- Carta (if you have US investors)
- Razorpay Rize or Leegality for Indian documentation
- A well-structured Excel/Google Sheet is fine at pre-seed and seed stage - the important thing is keeping it accurate and updated`,
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
