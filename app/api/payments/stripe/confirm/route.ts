import { z } from "zod"

import { getAuthenticatedAccount } from "@/lib/auth/session"
import { handleApi } from "@/lib/middlewares/api-handler"
import { HttpError } from "@/lib/errors/http-error"
import { requireGuestAccountAccess } from "@/lib/security/request-access"
import { stripe } from "@/lib/stripe"
import { orderService } from "@/features/orders/service"

const confirmStripePaymentSchema = z.object({
  sessionId: z.string().min(1),
})

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const { sessionId } = confirmStripePaymentSchema.parse(await request.json())
    const account = await getAuthenticatedAccount({ touch: true })
    const existingOrder = await orderService.getOrderByPaymentSessionId(sessionId)

    if (account) {
      if (existingOrder.userId !== account.user.id) {
        throw new HttpError(403, "Forbidden")
      }
    } else {
      await requireGuestAccountAccess(request, existingOrder.userId)
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (stripeSession.payment_status !== "paid") {
      throw new HttpError(400, "Stripe payment has not been completed")
    }

    const order = await orderService.confirmOnlineOrder(sessionId)

    return { data: order }
  })
}
