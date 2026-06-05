import { HttpError } from "@/lib/errors/http-error"
import { productRepository } from "@/features/products/repository"
import { sendAdminOrderConfirmedPush } from "@/features/admin-notifications/push"

import { orderRepository } from "./repository"
import { PaymentMethod, StatusCommande as StatusCommandeEnum } from "./types"
import type { CreateOrderInput, StatusCommande } from "./types"

interface GetOrdersFilters {
  userId?: number
  telephone?: string
}

export class OrderService {
  private aggregateItemsByProduct(items: Array<{ productId: number; quantite: number }>) {
    const quantities = new Map<number, number>()

    for (const item of items) {
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantite)
    }

    return quantities
  }

  private async validateStock(items: Array<{ productId: number; quantite: number }>) {
    const quantities = this.aggregateItemsByProduct(items)

    for (const [productId, requestedQty] of quantities) {
      const product = await productRepository.findById(productId)

      if (!product) {
        throw new HttpError(404, `Product ${productId} not found`)
      }

      if (!product.active) {
        throw new HttpError(400, `${product.nom} is not available`)
      }

      if (product.stock < requestedQty) {
        throw new HttpError(
          400,
          `Insufficient stock for ${product.nom}. Available: ${product.stock}, requested: ${requestedQty}`,
        )
      }
    }

    return quantities
  }

  private async decrementStock(quantities: Map<number, number>) {
    for (const [productId, requestedQty] of quantities) {
      const product = await productRepository.findById(productId)

      if (!product) {
        throw new HttpError(404, `Product ${productId} not found`)
      }

      const updatedProduct = await productRepository.updateStock(
        productId,
        product.stock - requestedQty,
      )

      if (!updatedProduct) {
        throw new HttpError(500, `Could not update stock for product ${productId}`)
      }
    }
  }

  async createOrder(input: CreateOrderInput) {
    if (input.paymentMethod === PaymentMethod.ENLIGNE) {
      await this.validateStock(input.items)

      const order = await orderRepository.create({
        ...input,
        status: input.status ?? StatusCommandeEnum.EN_COURS,
      })

      if (!order) {
        throw new HttpError(500, "Could not create order")
      }

      return order
    }

    const quantities = await this.validateStock(input.items)
    const order = await orderRepository.create(input)
    if (!order) {
      throw new HttpError(500, "Could not create order")
    }

    await this.decrementStock(quantities)

    if (order.status === StatusCommandeEnum.CONFIRMER) {
      await sendAdminOrderConfirmedPush(order)
    }

    return order
  }

  async confirmOnlineOrder(paymentSessionId: string) {
    const order = await orderRepository.findByPaymentSessionId(paymentSessionId)

    if (!order) {
      throw new HttpError(404, "Order not found for this Stripe session")
    }

    if (order.paymentMethod !== PaymentMethod.ENLIGNE) {
      throw new HttpError(400, "This order is not an online payment order")
    }

    if (order.status !== StatusCommandeEnum.EN_COURS) {
      return order
    }

    const quantities = await this.validateStock(order.items)
    await this.decrementStock(quantities)

    const confirmedOrder = await orderRepository.updatePaymentStatus(order.id, {
      status: StatusCommandeEnum.CONFIRMER,
    })

    if (!confirmedOrder) {
      throw new HttpError(500, "Could not confirm paid order")
    }

    await sendAdminOrderConfirmedPush(confirmedOrder)

    return confirmedOrder
  }

  async getOrders(filters?: GetOrdersFilters) {
    return orderRepository.findAll(filters)
  }

  async getOrderById(id: number) {
    const order = await orderRepository.findById(id)
    if (!order) {
      throw new HttpError(404, "Order not found")
    }
    return order
  }

  async getOrderByPaymentSessionId(paymentSessionId: string) {
    const order = await orderRepository.findByPaymentSessionId(paymentSessionId)
    if (!order) {
      throw new HttpError(404, "Order not found")
    }
    return order
  }

  async updateOrderStatus(id: number, status: StatusCommande) {
    const order = await orderRepository.updateStatus(id, status)
    if (!order) {
      throw new HttpError(404, "Order not found")
    }
    return order
  }

  async deleteOrder(id: number) {
    const deleted = await orderRepository.delete(id)
    if (!deleted) {
      throw new HttpError(404, "Order not found")
    }
  }
}

export const orderService = new OrderService()
