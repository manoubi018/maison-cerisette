import "server-only"

import { userRepository } from "@/features/users/repository"
import { HttpError } from "@/lib/errors/http-error"
import { guestSessionOwnsEmail } from "@/lib/security/guest-session"

export function getGuestSessionId(request: Request) {
  return request.headers.get("x-guest-session-id")?.trim() ?? null
}

export async function requireGuestAccountAccess(request: Request, userId: number) {
  const guestSessionId = getGuestSessionId(request)

  if (!guestSessionId) {
    throw new HttpError(401, "Guest session required")
  }

  const user = await userRepository.findById(userId)

  if (!user) {
    throw new HttpError(404, "User not found")
  }

  if (!guestSessionOwnsEmail(guestSessionId, user.email)) {
    throw new HttpError(403, "This guest account does not belong to the current browser session")
  }

  return {
    guestSessionId,
    user,
  }
}
