const GUEST_EMAIL_DOMAIN = "@guest.maison-cerisette.test"

function normalizeGuestSessionId(guestSessionId: string) {
  return guestSessionId.trim().toLowerCase()
}

export function buildGuestEmail(guestSessionId: string) {
  return `guest-${normalizeGuestSessionId(guestSessionId)}${GUEST_EMAIL_DOMAIN}`
}

export function isGuestSessionEmail(email: string) {
  return email.trim().toLowerCase().endsWith(GUEST_EMAIL_DOMAIN)
}

export function guestSessionOwnsEmail(guestSessionId: string, email: string) {
  return buildGuestEmail(guestSessionId) === email.trim().toLowerCase()
}
