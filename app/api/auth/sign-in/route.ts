import { NextResponse } from "next/server"

import { authService } from "@/features/auth/service"
import { applySessionCookie, createUserSession } from "@/lib/auth/session"
import { authValidator } from "@/features/auth/validator"
import { handleApi } from "@/lib/middlewares/api-handler"

export const runtime = "nodejs"

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = await request.json()
    const input = authValidator.validateSignIn(body)
    const user = await authService.signIn(input)
    const { token, session } = await createUserSession(user.id)
    const response = NextResponse.json(user)
    applySessionCookie(response, token, session.expiresAt)
    return response
  })
}
