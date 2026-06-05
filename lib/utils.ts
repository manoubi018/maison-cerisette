import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-TN", {
    style: "currency",
    currency: "TND",
  }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-TN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function calculateShippingFee(total: number, isSameDay: boolean): number {
  if (total > 300) return 0
  return isSameDay ? 15.0 : 8.5
}

export function estimateDeliveryDate(isSameDay: boolean): Date {
  const date = new Date()
  if (isSameDay) {
    return date
  } else {
    date.setDate(date.getDate() + 1)
    return date
  }
}
