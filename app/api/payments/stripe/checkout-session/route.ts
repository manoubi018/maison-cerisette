import { z } from "zod"
import Stripe from "stripe"

import { getAuthenticatedAccount } from "@/lib/auth/session"
import { handleApi } from "@/lib/middlewares/api-handler"
import { HttpError } from "@/lib/errors/http-error"
import { requireGuestAccountAccess } from "@/lib/security/request-access"
import { stripe, stripeCheckoutCurrency, stripeTndToEurRate } from "@/lib/stripe"
import { productRepository } from "@/features/products/repository"
import { orderService } from "@/features/orders/service"
import { PaymentMethod, StatusCommande } from "@/features/orders/types"

const createCheckoutSessionSchema = z.object({
  userId: z.number().int().positive().optional(),
  telephone: z.string().min(6),
  deliveryFee: z.number().min(0),
  shippingAddress: z.object({
    country: z.string().min(2),
    city: z.string().min(2),
    street: z.string().min(2),
    postalCode: z.string().min(2),
  }),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantite: z.number().int().positive(),
      }),
    )
    .min(1),
})

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = createCheckoutSessionSchema.parse(await request.json())
    const account = await getAuthenticatedAccount({ touch: true })
    const origin = new URL(request.url).origin

    const userId = account ? account.user.id : body.userId

    if (!userId) {
      throw new HttpError(400, "Guest checkout requires a valid userId")
    }

    if (!account) {
      await requireGuestAccountAccess(request, userId)
    }

    const stripeLineItems = []
    let subtotal = 0
    const convertTndToStripeAmount = (amountTnd: number) => {
      const convertedAmount =
        stripeCheckoutCurrency === "eur"
          ? amountTnd * stripeTndToEurRate
          : amountTnd

      return Math.round(convertedAmount * 100)
    }

    for (const item of body.items) {
      const product = await productRepository.findById(item.productId)

      if (!product) {
        throw new HttpError(404, `Product ${item.productId} not found`)
      }

      if (!product.active) {
        throw new HttpError(400, `${product.nom} is not available`)
      }

      if (product.stock < item.quantite) {
        throw new HttpError(
          400,
          `Insufficient stock for ${product.nom}. Available: ${product.stock}, requested: ${item.quantite}`,
        )
      }

      const unitAmount = convertTndToStripeAmount(product.prix)
      subtotal += product.prix * item.quantite

      stripeLineItems.push({
        quantity: item.quantite,
        price_data: {
          currency: stripeCheckoutCurrency,
          unit_amount: unitAmount,
          product_data: {
            name: product.nom,
            description: product.description ?? undefined,
          },
        },
      })
    }

    if (body.deliveryFee > 0) {
      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: stripeCheckoutCurrency,
          unit_amount: convertTndToStripeAmount(body.deliveryFee),
          product_data: {
            name: "Delivery",
          },
        },
      })
    }

    let session: Stripe.Checkout.Session

    try {
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout?payment_cancelled=1`,
        payment_method_types: ["card"],
        line_items: stripeLineItems,
      })
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        const lowerMessage = error.message.toLowerCase()

        if (lowerMessage.includes(`invalid currency: ${stripeCheckoutCurrency}`)) {
          throw new HttpError(
            400,
            `Stripe refuses ${stripeCheckoutCurrency.toUpperCase()} for this account. Update your Stripe account configuration or choose another supported checkout currency.`,
          )
        }

        throw new HttpError(400, error.message)
      }

      throw error
    }

    const total = subtotal + body.deliveryFee

    const order = await orderService.createOrder({
      userId,
      telephone: body.telephone,
      status: StatusCommande.EN_COURS,
      paymentMethod: PaymentMethod.ENLIGNE,
      paymentSessionId: session.id,
      total,
      shippingAddress: body.shippingAddress,
      items: body.items,
    })

    return {
      data: {
        checkoutUrl: session.url,
        sessionId: session.id,
        orderId: order.id,
      },
      status: 201,
    }
  })
}
