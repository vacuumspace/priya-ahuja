import { auth } from "@/lib/auth"
import ContactForm from "./ContactForm"

export default async function ContactPage() {
  const session = await auth()
  return (
    <ContactForm
      defaultName={session?.user?.name ?? ""}
      defaultEmail={session?.user?.email ?? ""}
    />
  )
}
