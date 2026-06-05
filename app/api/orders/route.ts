import { getAuthenticatedAccount } from "@/lib/auth/session"
import { orderService } from "@/features/orders/service"
import { orderValidator } from "@/features/orders/validator"
import { HttpError } from "@/lib/errors/http-error"
import { handleApi } from "@/lib/middlewares/api-handler"
import { requireGuestAccountAccess } from "@/lib/security/request-access"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const account = await getAuthenticatedAccount({ touch: true })
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get("userId")
    let userId: number | undefined

    if (account) {
      const orders = await orderService.getOrders({ userId: account.user.id })
      return { data: orders }
    }

    if (userIdParam) {
      const parsedUserId = Number(userIdParam)

      if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
        throw new HttpError(400, "Invalid userId")
      }

      userId = parsedUserId
    }

    if (!userId) {
      throw new HttpError(400, "Guest order access requires a valid userId")
    }

    await requireGuestAccountAccess(request, userId)

    const orders = await orderService.getOrders({ userId })
    return { data: orders }
  })
}

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = await request.json()
    const account = await getAuthenticatedAccount({ touch: true })
    const input = orderValidator.validateCreateOrder(
      account
        ? {
            ...body,
            userId: account.user.id,
          }
        : body,
    )

    if (!account) {
      await requireGuestAccountAccess(request, input.userId)
    }

    const order = await orderService.createOrder(input)
    return { data: order, status: 201 }
  })
}
