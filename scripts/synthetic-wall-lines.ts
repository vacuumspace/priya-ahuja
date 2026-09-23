// Shared pool of synthetic wall lines, used by seed-synthetic-wall.ts and
// rewrite-synthetic-wall.ts. Written to read like real founders typing fast:
// mostly sentence case, a few all-lowercase, the odd typo or grammar slip.
export const WIN_TEMPLATES: string[] = [
  "Closed our first paying customer!! still cant believe it",
  "Got a 5 star review from a customer, made my whole day",
  "Finally fixed the bug that was killing our conversions",
  "Shipped the new landing page. Looks so much better now",
  "Highest daily signups ever today",
  "Got featured in a newsletter, didnt even pitch them",
  "Had a really good call with an angel investor",
  "Launched on Product Hunt, nervous but done",
  "Hired our first team member 🎉",
  "Crossed ₹1L in monthly revenue this month",
  "Got our first enterprise lead, fingers crossed",
  "Recorded the product demo video after putting it off for 2 weeks",
  "Onboarding changes are working, churn is down a bit",
  "Signed our first partner",
  "Posted on LinkedIn every day this week. Consistency finally",
  "3 sales calls back to back and all went well",
  "Built the referral program, going live tomorrow",
  "Someone quoted us in a founders thread on twitter",
  "Crossed 1000 users!",
  "Started reaching out to new investors",
  "Booked 5 intro calls for this week",
  "Fixed a pricing page bug that was there since weeks",
  "Got our first proper testimonial on record",
  "Ran our first paid ad test with ₹2000. Learnt a lot",
  "Wrote our first cold outreach sequence",
  "Activation rate went up after the new flow",
  "Shipped the feature everyone kept asking for",
  "Replied to every single customer feedback mail. Inbox zero",
  "Onboarded our first enterprise pilot",
  "Got a warm intro to an investor through a friend",
  "Rewrote all our onboarding emails",
  "Did 4 user interviews, so many insights",
  "Renegotiated with our vendor and saved some money",
  "Published our first case study",
  "A customer gave us a shoutout on instagram without us asking",
  "Pricing page redesign is finally done",
  "Set up analytics which we were avoiding for months",
  "Closed a deal that was stuck for weeks. Relieved",
  "Page load time is down to half",
  "Sent the monthly investor update on time for once",
  "Best week for signups so far",
  "People are liking the new UI, got some nice messages",
  "Automated a manual process that used to eat 2 hours daily",
  "Made the hiring plan for next quarter",
  "Good advisor call today, got clarity on pricing",
  "Mobile version is live now",
  "Closed a small upsell but it feels big",
  "Got our first organic backlink",
  "Ran a workshop, people stayed till the end and asked alot of questions",
  "Fixed the biggest drop off in our checkout",
  "An existing customer referred us to their friend",
  "Sent our first email campaign, 42% open rate",
  "Support response time is under 1 hour now",
  "Partnership talks moving forward finally",
  "Someone mentioned our product in a whatsapp community",
  "Finished a painful refactor. Never again",
  "Hit our weekly revenue target",
  "New channel is showing some early traction",
  "Cleaned up tech debt that was slowing us down",
  "Closed the books for the month, no surprises",
  "Shipped a fix customers have been asking since long",
  "Got my first order from outside my city",
  "Spoke to 10 customers today, my throat is gone lol",
  "Our instagram reel crossed 10k views",
  "Got a repeat order from a customer who was not happy last time",
  // A few typed all-lowercase, like people do on their phone.
  "closed 2 new clients today",
  "shipped the new onboarding, fingers crossed",
  "got our first payment through the website",
  "finally launched the waitlist, 60 signups in a day",
  "fixed the login issue that was bugging everyone",
  "had a good chat with a potential cofounder",
  "sent out the proposal before deadline for once",
]

// Each persona writes in its own voice, so the wall doesn't read like one
// person typing under 30 names. Applied on top of the shared lines above.
export type Voice = "plain" | "lower" | "terse" | "hype" | "formal" | "emoji" | "tick" | "casual" | "sloppy" | "desi"

const pickOne = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const stripEnd = (s: string) => s.replace(/[.!\s]+$/u, "")
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const noEmoji = (s: string) => s.replace(/\s*\p{Extended_Pictographic}️?/gu, "").trim()

export function applyVoice(line: string, voice: Voice): string {
  switch (voice) {
    case "lower":
      return stripEnd(line.toLowerCase())
    case "terse":
      return stripEnd(noEmoji(line).toLowerCase().replace(/^(finally|so|also) /, "").replace(/,.*$/, ""))
    case "hype":
      return cap(stripEnd(noEmoji(line))) + pickOne(["!!", "!! 🚀", "!!! 🎉", " 🔥🔥", "!"])
    case "formal":
      return cap(stripEnd(noEmoji(line).replace(/\s+lol$/, ""))) + "."
    case "emoji":
      return cap(stripEnd(line)) + " " + pickOne(["🙌", "✨", "💪", "🥳", "😊"])
    case "tick":
      return cap(stripEnd(noEmoji(line))) + " ✅"
    case "casual":
      return stripEnd(line.charAt(0).toLowerCase() + line.slice(1)) + pickOne([" lol", " :)", " 😅", "", " haha"])
    case "sloppy":
      return stripEnd(line.toLowerCase())
        .replace(/'/g, "")
        .replace(/\band\b/g, "&")
        .replace(/\bfor\b/g, "4")
        .replace(/\byou\b/g, "u")
        .replace(/\breally\b/g, "rly")
    case "desi":
      return cap(stripEnd(line)) + pickOne([" yaar", " 🙏", ", finally", " bhai", ""])
    default:
      return line
  }
}

// Each persona posts on a random subset of days, at its own activity rate -
// some are near-daily, some post every couple of days, like a real cohort.
export const PERSONAS: { name: string; activity: number; voice: Voice }[] = [
  { name: "Rhea Kapadia", activity: 0.9, voice: "formal" },
  { name: "Ananya Iyer", activity: 0.7, voice: "casual" },
  { name: "Karan Mehta", activity: 0.6, voice: "sloppy" },
  { name: "Priya Shah", activity: 0.75, voice: "plain" },
  { name: "Dev Kapoor", activity: 0.55, voice: "desi" },
  { name: "Meera Nair", activity: 0.65, voice: "emoji" },
  { name: "Arjun Reddy", activity: 0.6, voice: "lower" },
  { name: "Sanya Kapoor", activity: 0.7, voice: "tick" },
  { name: "Vikram Rao", activity: 0.5, voice: "formal" },
  { name: "Tanvi Desai", activity: 0.68, voice: "hype" },
  { name: "Rohan Bhatt", activity: 0.58, voice: "hype" },
  { name: "Isha Malhotra", activity: 0.62, voice: "casual" },
  { name: "Aditya Menon", activity: 0.55, voice: "terse" },
  { name: "Neha Joshi", activity: 0.72, voice: "emoji" },
  { name: "Kabir Singh", activity: 0.8, voice: "terse" },
  { name: "Ritika Verma", activity: 0.6, voice: "plain" },
  { name: "Yash Trivedi", activity: 0.5, voice: "sloppy" },
  { name: "Simran Kaur", activity: 0.65, voice: "desi" },
  { name: "Aman Gupta", activity: 0.7, voice: "emoji" },
  { name: "Divya Pillai", activity: 0.6, voice: "casual" },
  { name: "Nikhil Bose", activity: 0.55, voice: "lower" },
  { name: "Aarushi Chawla", activity: 0.68, voice: "hype" },
  { name: "Siddharth Oberoi", activity: 0.6, voice: "formal" },
  { name: "Pooja Rathi", activity: 0.72, voice: "tick" },
  { name: "Varun Sethi", activity: 0.52, voice: "hype" },
  { name: "Ishaan Kohli", activity: 0.58, voice: "terse" },
  { name: "Kritika Bhalla", activity: 0.65, voice: "plain" },
  { name: "Manav Chandra", activity: 0.5, voice: "sloppy" },
  { name: "Riya Sarin", activity: 0.7, voice: "casual" },
  { name: "Zoya Ahmed", activity: 0.62, voice: "emoji" },
  { name: "Harsh Vardhan", activity: 0.55, voice: "desi" },
  { name: "Tara Krishnan", activity: 0.66, voice: "formal" },
]
