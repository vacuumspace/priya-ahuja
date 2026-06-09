// This route is handled by app/page.tsx which takes precedence.
// This file must exist so (public)/layout.tsx has a valid child,
// but it renders nothing.
export default function PublicHomePlaceholder() {
  return null
}
