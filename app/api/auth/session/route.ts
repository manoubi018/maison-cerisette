import { getAuthenticatedAccount } from "@/lib/auth/session"
import { HttpError } from "@/lib/errors/http-error"
import { handleApi } from "@/lib/middlewares/api-handler"

export const runtime = "nodejs"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const account = await getAuthenticatedAccount({ touch: true })

    if (!account) {
      throw new HttpError(401, "Authentication required")
    }

    return { data: account.user }
  })
}
