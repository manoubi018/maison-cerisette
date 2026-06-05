import { getAuthenticatedAccount } from "@/lib/auth/session"
import { userService } from "@/features/users/service"
import { userValidator } from "@/features/users/validator"
import { HttpError } from "@/lib/errors/http-error"
import { handleApi } from "@/lib/middlewares/api-handler"
import { requireGuestAccountAccess } from "@/lib/security/request-access"

function parseUserId(rawId: string) {
  const userId = Number(rawId)
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new HttpError(400, "Invalid userId")
  }
  return userId
}

export async function GET(
  request: Request,
  context: { params: { userId: string } | Promise<{ userId: string }> },
) {
  return handleApi(request, async () => {
    const { userId: rawId } = await Promise.resolve(context.params)
    const userId = parseUserId(rawId)
    const account = await getAuthenticatedAccount({ touch: true })

    if (account) {
      if (account.user.id !== userId) {
        throw new HttpError(403, "You do not have access to this account")
      }
    } else {
      await requireGuestAccountAccess(request, userId)
    }

    const user = await userService.getUserById(userId)
    return { data: user }
  })
}

export async function PATCH(
  request: Request,
  context: { params: { userId: string } | Promise<{ userId: string }> },
) {
  return handleApi(request, async () => {
    const { userId: rawId } = await Promise.resolve(context.params)
    const userId = parseUserId(rawId)
    const account = await getAuthenticatedAccount({ touch: true })

    if (account) {
      if (account.user.id !== userId) {
        throw new HttpError(403, "You do not have access to this account")
      }
    } else {
      await requireGuestAccountAccess(request, userId)
    }

    const body = await request.json()
    const input = userValidator.validateClientUpdateUser(body)
    const user = await userService.updateUser(userId, input)
    return { data: user }
  })
}

export async function DELETE(
  request: Request,
  context: { params: { userId: string } | Promise<{ userId: string }> },
) {
  return handleApi(request, async () => {
    throw new HttpError(405, "Deleting users is not available in the client application")
  })
}
