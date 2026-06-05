import { handleApi } from "@/lib/middlewares/api-handler"

import { emailVerificationService } from "@/features/auth/email-verification-service"
import { authValidator } from "@/features/auth/validator"

export const runtime = "nodejs"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const { searchParams } = new URL(request.url)
    const input = authValidator.validateEmailVerificationStatus({
      email: searchParams.get("email"),
    })

    return {
      data: await emailVerificationService.getStatus(input.email),
    }
  })
}
