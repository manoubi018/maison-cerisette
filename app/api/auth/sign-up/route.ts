import { NextResponse } from "next/server"

import { authService } from "@/features/auth/service"
import { applySessionCookie, createUserSession } from "@/lib/auth/session"
import { authValidator } from "@/features/auth/validator"
import { handleApi } from "@/lib/middlewares/api-handler"
import { getGuestSessionId } from "@/lib/security/request-access"

export const runtime = "nodejs"

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = await request.json()
    const input = authValidator.validateSignUp(body)
    const user = await authService.signUp({
      ...input,
      guestSessionId: input.guestUserId ? getGuestSessionId(request) ?? undefined : undefined,
    })
    const { token, session } = await createUserSession(user.id)
    const response = NextResponse.json(user, { status: 201 })
    applySessionCookie(response, token, session.expiresAt)
    return response
  })
}
