import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, services as servicesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import FeedbackForm from "./FeedbackForm"

type Props = { params: Promise<{ bookingId: string }> }

export default async function FeedbackPage({ params }: Props) {
  const { bookingId } = await params
  const session = await auth()
  if (!session?.user?.email) redirect("/my-activity")

  const [row] = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      userEmail: bookings.userEmail,
      feedbackRating: bookings.feedbackRating,
      feedbackText: bookings.feedbackText,
      serviceTitle: servicesTable.title,
    })
    .from(bookings)
    .leftJoin(servicesTable, eq(bookings.serviceId, servicesTable.id))
    .where(eq(bookings.id, bookingId))
    .limit(1)

  if (!row || row.userEmail !== session.user.email) notFound()
  if (row.status !== "completed") redirect("/my-activity")

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <FeedbackForm
          bookingId={row.id}
          serviceTitle={row.serviceTitle ?? "your session"}
          existingRating={row.feedbackRating}
          existingText={row.feedbackText}
        />
      </div>
    </div>
  )
}
