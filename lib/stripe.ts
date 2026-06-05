import "server-only"

import Stripe from "stripe"

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name} in .env.local`)
  }

  return value
}

function getOptionalEnv(name: string) {
  return process.env[name]?.trim() || null
}

function getPositiveNumberEnv(name: string, fallback?: number) {
  const value = getOptionalEnv(name)

  if (!value) {
    if (fallback === undefined) {
      throw new Error(`Missing ${name} in .env.local`)
    }

    return fallback
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${name} in .env.local`)
  }

  return parsed
}

export const stripePublishableKey = getRequiredEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
export const stripeCheckoutCurrency = (getOptionalEnv("STRIPE_CHECKOUT_CURRENCY") ?? "eur").toLowerCase()
export const stripeTndToEurRate = getPositiveNumberEnv("STRIPE_TND_TO_EUR_RATE", 0.30)

export const stripe = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2026-04-22.dahlia",
})
