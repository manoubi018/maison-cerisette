import { requireAuthenticatedAccount } from "@/lib/auth/session"
import { handleApi } from "@/lib/middlewares/api-handler"

import { userService } from "@/features/users/service"
import { userValidator } from "@/features/users/validator"

export const runtime = "nodejs"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const account = await requireAuthenticatedAccount()
    return { data: account.user }
  })
}

export async function PATCH(request: Request) {
  return handleApi(request, async () => {
    const account = await requireAuthenticatedAccount()
    const body = await request.json()
    const input = userValidator.validateClientUpdateUser(body)
    const user = await userService.updateUser(account.user.id, input)
    return { data: user }
  })
}
