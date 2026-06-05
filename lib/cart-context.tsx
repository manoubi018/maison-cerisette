"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  weight?: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateItem: (productId: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      setItems(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === newItem.productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === newItem.productId ? { ...item, quantity: item.quantity + newItem.quantity } : item,
        )
      }
      return [...prev, newItem]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateItem = (productId: string, updates: Partial<CartItem>) => {
    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, ...updates } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
