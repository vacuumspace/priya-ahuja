import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, startupIdeaScores, pitchDeckAnalyses, pitchDeckUnlocks, toolUnlocks, services, digitalProducts, users, priyaGptTimeTransactions, priyaGptTimeUnlocks } from "@/lib/db/schema"
import { and, eq, inArray, isNotNull, like } from "drizzle-orm"

const OPEN_UNLOCK_STATUSES = ["paid", "refunded"] as const

const PAGE_SIZE = 10

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const offset = (page - 1) * PAGE_SIZE
  const typeFilter = searchParams.get("type")

  // Fetch all sources
  const [allBookings, allPurchases, allScores, allIdeaScores, allPitchDecks, unusedPitchDeckUnlocks, allPriyaGpt, unusedToolUnlocks, unusedPriyaGptUnlocks] = await Promise.all([
    db
      .select({
        id: bookings.id,
        userName: bookings.userName,
        userEmail: bookings.userEmail,
        razorpayPaymentId: bookings.razorpayPaymentId,
        status: bookings.status,
        createdAt: bookings.createdAt,
        itemName: services.title,
        amount: bookings.amountPaid,
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(inArray(bookings.status, ["confirmed", "completed", "paid"])),

    db
      .select({
        id: purchases.id,
        userName: purchases.userName,
        userEmail: purchases.userEmail,
        razorpayPaymentId: purchases.razorpayPaymentId,
        createdAt: purchases.createdAt,
        itemName: digitalProducts.title,
        slug: digitalProducts.slug,
        amount: purchases.amountPaid,
        price: digitalProducts.price,
      })
      .from(purchases)
      .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(like(purchases.razorpayPaymentId, "pay_%"), isNotNull(purchases.amountPaid))),

    db
      .select({
        id: startupScores.id,
        userId: startupScores.userId,
        amountPaid: startupScores.amountPaid,
        razorpayPaymentId: startupScores.razorpayPaymentId,
        createdAt: startupScores.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(startupScores)
      .leftJoin(users, eq(startupScores.userId, users.id))
      .where(eq(startupScores.isPaid, true)),

    db
      .select({
        id: startupIdeaScores.id,
        userId: startupIdeaScores.userId,
        amountPaid: startupIdeaScores.amountPaid,
        razorpayPaymentId: startupIdeaScores.razorpayPaymentId,
        createdAt: startupIdeaScores.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(startupIdeaScores)
      .leftJoin(users, eq(startupIdeaScores.userId, users.id))
      .where(eq(startupIdeaScores.isPaid, true)),

    db
      .select({
        id: pitchDeckAnalyses.id,
        amountPaid: pitchDeckAnalyses.amountPaid,
        razorpayPaymentId: pitchDeckAnalyses.razorpayPaymentId,
        createdAt: pitchDeckAnalyses.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(pitchDeckAnalyses)
      .leftJoin(users, eq(pitchDeckAnalyses.userId, users.id))
      .where(eq(pitchDeckAnalyses.isPaid, true)),

    // Captured payments where the buyer hasn't run the analysis yet, plus
    // any refunded before use - consumed unlocks show up as
    // pitch_deck_analyses rows instead
    db
      .select({
        id: pitchDeckUnlocks.id,
        amountPaise: pitchDeckUnlocks.amountPaise,
        razorpayPaymentId: pitchDeckUnlocks.razorpayPaymentId,
        unlockStatus: pitchDeckUnlocks.status,
        createdAt: pitchDeckUnlocks.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(pitchDeckUnlocks)
      .leftJoin(users, eq(pitchDeckUnlocks.userId, users.id))
      .where(inArray(pitchDeckUnlocks.status, OPEN_UNLOCK_STATUSES)),

    db
      .select({
        id: priyaGptTimeTransactions.id,
        amountPaise: priyaGptTimeTransactions.amountPaise,
        razorpayPaymentId: priyaGptTimeTransactions.razorpayPaymentId,
        createdAt: priyaGptTimeTransactions.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(priyaGptTimeTransactions)
      .leftJoin(users, eq(priyaGptTimeTransactions.userId, users.id))
      .where(eq(priyaGptTimeTransactions.reason, "purchase")),

    // Captured startup-score / idea-score payments where the quiz hasn't
    // been submitted yet, plus any refunded before use - consumed unlocks
    // show up via their score tables instead
    db
      .select({
        id: toolUnlocks.id,
        tool: toolUnlocks.tool,
        amountPaise: toolUnlocks.amountPaise,
        razorpayPaymentId: toolUnlocks.razorpayPaymentId,
        unlockStatus: toolUnlocks.status,
        createdAt: toolUnlocks.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(toolUnlocks)
      .leftJoin(users, eq(toolUnlocks.userId, users.id))
      .where(inArray(toolUnlocks.status, OPEN_UNLOCK_STATUSES)),

    // Captured PriyaGPT time payments not yet applied to a balance, plus
    // any refunded before use
    db
      .select({
        id: priyaGptTimeUnlocks.id,
        minutes: priyaGptTimeUnlocks.minutes,
        amountPaise: priyaGptTimeUnlocks.amountPaise,
        razorpayPaymentId: priyaGptTimeUnlocks.razorpayPaymentId,
        unlockStatus: priyaGptTimeUnlocks.status,
        createdAt: priyaGptTimeUnlocks.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(priyaGptTimeUnlocks)
      .leftJoin(users, eq(priyaGptTimeUnlocks.userId, users.id))
      .where(inArray(priyaGptTimeUnlocks.status, OPEN_UNLOCK_STATUSES)),
  ])

  type TxRow = {
    id: string
    type: string
    userName: string
    userEmail: string
    itemName: string
    amount: number | null
    razorpayPaymentId: string | null
    status: string
    createdAt: Date
  }

  const all: TxRow[] = [
    ...allBookings.map((r) => ({
      id: r.id,
      type: "booking",
      userName: r.userName,
      userEmail: r.userEmail ?? "",
      itemName: r.itemName ?? "Session",
      amount: r.amount ?? null,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
    ...allPurchases.map((r) => ({
      id: r.id,
      type: r.slug === "angel-investor-list" ? "angel" : "template",
      userName: r.userName,
      userEmail: r.userEmail ?? "",
      itemName: r.itemName ?? "Template",
      amount: r.amount ?? r.price ?? null,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
    ...allScores.map((r) => ({
      id: r.id,
      type: "score",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: "Startup Score",
      amount: r.amountPaid,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
    ...allIdeaScores.map((r) => ({
      id: r.id,
      type: "ideascore",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: "Startup Idea Score",
      amount: r.amountPaid,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
    ...allPitchDecks.map((r) => ({
      id: r.id,
      type: "pitchdeck",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: "Pitch Deck Analysis",
      amount: r.amountPaid,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
    ...unusedPitchDeckUnlocks.map((r) => ({
      id: r.id,
      type: "pitchdeck",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: r.unlockStatus === "refunded" ? "Pitch Deck Analysis (refunded, not run)" : "Pitch Deck Analysis (paid, not run yet)",
      amount: r.amountPaise,
      razorpayPaymentId: r.razorpayPaymentId,
      status: r.unlockStatus,
      createdAt: r.createdAt,
    })),
    ...unusedToolUnlocks.map((r) => ({
      id: r.id,
      type: r.tool === "startup-idea-score" ? "ideascore" : "score",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: `${r.tool === "startup-idea-score" ? "Startup Idea Score" : "Startup Score"} ${r.unlockStatus === "refunded" ? "(refunded, not taken)" : "(paid, not taken yet)"}`,
      amount: r.amountPaise,
      razorpayPaymentId: r.razorpayPaymentId,
      status: r.unlockStatus,
      createdAt: r.createdAt,
    })),
    ...allPriyaGpt.map((r) => ({
      id: r.id,
      type: "priyagpt",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: "PriyaGPT Time",
      amount: r.amountPaise,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
    ...unusedPriyaGptUnlocks.map((r) => ({
      id: r.id,
      type: "priyagpt",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: `PriyaGPT Time - ${r.minutes} min ${r.unlockStatus === "refunded" ? "(refunded, not credited)" : "(paid, not credited yet)"}`,
      amount: r.amountPaise,
      razorpayPaymentId: r.razorpayPaymentId,
      status: r.unlockStatus,
      createdAt: r.createdAt,
    })),
  ]

  const filtered = typeFilter ? all.filter((r) => r.type === typeFilter) : all
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const total = filtered.length
  const page_data = filtered.slice(offset, offset + PAGE_SIZE).map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))

  return Response.json({ transactions: page_data, total, page, pageSize: PAGE_SIZE })
}
