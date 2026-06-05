import { NextResponse } from "next/server"

import { authService } from "@/features/auth/service"
import { userSessionRepository } from "@/features/sessions/repository"
import { applySessionCookie, createUserSession, requireAuthenticatedAccount } from "@/lib/auth/session"
import { authValidator } from "@/features/auth/validator"
import { handleApi } from "@/lib/middlewares/api-handler"

export const runtime = "nodejs"

export async function PATCH(request: Request) {
  return handleApi(request, async () => {
    const account = await requireAuthenticatedAccount()
    const body = await request.json()
    const input = authValidator.validateUpdatePassword(body)
    const user = await authService.updatePassword({
      userId: account.user.id,
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
    })

    await userSessionRepository.revokeAllForUser(account.user.id)

    const { token, session } = await createUserSession(account.user.id)
    const response = NextResponse.json(user)
    applySessionCookie(response, token, session.expiresAt)
    return response
  })
}
