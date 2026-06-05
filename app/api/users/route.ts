import { userService } from "@/features/users/service"
import { userValidator } from "@/features/users/validator"
import { HttpError } from "@/lib/errors/http-error"
import { handleApi } from "@/lib/middlewares/api-handler"
import { guestSessionOwnsEmail } from "@/lib/security/guest-session"
import { getGuestSessionId } from "@/lib/security/request-access"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    throw new HttpError(403, "User directory access is not available in the client application")
  })
}

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = await request.json()
    const input = userValidator.validateClientCreateUser(body)
    const guestSessionId = getGuestSessionId(request)

    if (!guestSessionId || !guestSessionOwnsEmail(guestSessionId, input.email)) {
      throw new HttpError(403, "Guest account creation requires the current browser guest session")
    }

    const user = await userService.createUser(input)
    return { data: user, status: 201 }
  })
}
