import { NextResponse } from "next/server"

import { userSessionRepository } from "@/features/sessions/repository"
import { clearSessionCookie, getAuthenticatedAccount } from "@/lib/auth/session"
import { handleApi } from "@/lib/middlewares/api-handler"

export const runtime = "nodejs"

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const account = await getAuthenticatedAccount()

    if (account) {
      await userSessionRepository.revoke(account.session.id)
    }

    const response = NextResponse.json({ success: true })
    clearSessionCookie(response)
    return response
  })
}
