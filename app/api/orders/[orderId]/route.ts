import { requireAuthenticatedAccount } from "@/lib/auth/session"
import { orderService } from "@/features/orders/service"
import { HttpError } from "@/lib/errors/http-error"
import { handleApi } from "@/lib/middlewares/api-handler"

function parseOrderId(rawId: string) {
  const orderId = Number(rawId)
  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new HttpError(400, "Invalid orderId")
  }
  return orderId
}

export async function GET(
  request: Request,
  context: { params: { orderId: string } | Promise<{ orderId: string }> },
) {
  return handleApi(request, async () => {
    const account = await requireAuthenticatedAccount()
    const { orderId: rawId } = await Promise.resolve(context.params)
    const orderId = parseOrderId(rawId)
    const order = await orderService.getOrderById(orderId)

    if (order.userId !== account.user.id) {
      throw new HttpError(403, "You do not have access to this order")
    }

    return { data: order }
  })
}

export async function PATCH(
  request: Request,
  context: { params: { orderId: string } | Promise<{ orderId: string }> },
) {
  return handleApi(request, async () => {
    throw new HttpError(405, "Updating order status is not available in the client application")
  })
}

export async function DELETE(
  request: Request,
  context: { params: { orderId: string } | Promise<{ orderId: string }> },
) {
  return handleApi(request, async () => {
    throw new HttpError(405, "Deleting orders is not available in the client application")
  })
}
