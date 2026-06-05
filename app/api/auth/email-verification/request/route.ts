import { handleApi } from "@/lib/middlewares/api-handler"

import { emailVerificationService } from "@/features/auth/email-verification-service"
import { authValidator } from "@/features/auth/validator"

export const runtime = "nodejs"

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = await request.json()
    const input = authValidator.validateEmailVerificationRequest(body)
    const origin = new URL(request.url).origin

    return {
      data: await emailVerificationService.request(input.email, origin),
      status: 201,
    }
  })
}
