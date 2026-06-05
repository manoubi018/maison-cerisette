import "server-only"

import webpush from "web-push"

import { dbClient } from "@/lib/db/client"

import type { Commande } from "@/features/orders/types"

type AdminPushSubscriptionRow = {
  id: number
  endpoint: string
  p256dh: string
  auth: string
  active: boolean
}

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY
  const privateKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY
  const contact = process.env.WEB_PUSH_CONTACT ?? "mailto:admin@example.com"

  if (!publicKey || !privateKey) {
    console.warn("Web Push is not configured. Missing VAPID keys.")
    return false
  }

  webpush.setVapidDetails(contact, publicKey, privateKey)
  return true
}

async function getActiveSubscriptions() {
  return dbClient.query<AdminPushSubscriptionRow[]>({
    table: "admin_push_subscriptions",
    method: "select",
    select: "*",
    filters: { active: true },
  })
}

async function deactivateSubscription(id: number) {
  await dbClient.query<AdminPushSubscriptionRow[]>({
    table: "admin_push_subscriptions",
    method: "update",
    filters: { id },
    body: {
      active: false,
      updated_at: new Date().toISOString(),
    },
  })
}

export async function sendAdminOrderConfirmedPush(order: Commande) {
  if (!configureWebPush()) {
    return
  }

  try {
    const subscriptions = await getActiveSubscriptions()
    const payload = JSON.stringify({
      title: "Nouvelle commande confirmee",
      body: `La commande #${order.id} a ete confirmee.`,
      tag: `order-${order.id}`,
      url: `/dashboard/orders?orderId=${order.id}`,
      icon: "/icon-light-32x32.png",
      badge: "/icon-dark-32x32.png",
    })

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload,
          )
        } catch (error) {
          const statusCode =
            error && typeof error === "object" && "statusCode" in error
              ? Number(error.statusCode)
              : null

          if (statusCode === 404 || statusCode === 410) {
            await deactivateSubscription(subscription.id)
            return
          }

          console.error("Could not send admin push notification", error)
        }
      }),
    )
  } catch (error) {
    console.error("Could not load admin push subscriptions", error)
  }
}
