"use client"

import type React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useCurrentAccount } from "@/lib/account-context"
import { useOrders } from "@/lib/orders-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PaymentMethod, StatusCommande } from "@/features/orders/types"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useCatalogProducts } from "@/lib/use-catalog-products"

type ApiOrder = {
  id: number
  createdAt: string
}

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "")
}

const GOVERNORATES = [
  "Tunis",
  "Sfax",
  "Sousse",
  "Nabeul",
  "Gafsa",
  "Tataouine",
  "Bizerte",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Zaghouan",
  "Mahdia",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Tozeur",
  "Kébili",
  "Jendouba",
  "Le Kef",
  "Siliana",
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { addOrder } = useOrders()
  const { currentAccount, ensureGuestUser } = useCurrentAccount()
  const { t } = useLanguage()
  const { products } = useCatalogProducts()

  const [step, setStep] = useState<"shipping" | "payment" | "confirm">("shipping")
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    postalCode: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  })
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash")
  const [isProcessing, setIsProcessing] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "sameday">("standard")
  const [submitError, setSubmitError] = useState("")
  const [shippingMode, setShippingMode] = useState<"manual" | "current-location">("manual")
  const [isLocating, setIsLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState("")

  const deliveryFee = deliveryOption === "sameday" ? 15.0 : 8.5
  const finalTotal = total + deliveryFee
  const productsById = new Map(products.map((product) => [product.id, product]))
  const stockIssues = items
    .map((item) => {
      const product = productsById.get(item.productId)

      if (!product) {
        return t("One or more products are no longer available.", "Un ou plusieurs produits ne sont plus disponibles.")
      }

      if (product.stock <= 0) {
        return t(`${item.name} is out of stock.`, `${item.name} est en rupture de stock.`)
      }

      if (item.quantity > product.stock) {
        return t(
          `Only ${product.stock} item(s) are available for ${item.name}.`,
          `Seulement ${product.stock} article(s) sont disponibles pour ${item.name}.`,
        )
      }

      return null
    })
    .filter((issue): issue is string => issue !== null)
  const hasStockIssues = stockIssues.length > 0

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || currentAccount.profile.fullName,
      phone: prev.phone || currentAccount.profile.phone,
    }))
  }, [currentAccount.profile.fullName, currentAccount.profile.phone])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("payment_cancelled") === "1") {
      setSubmitError(
        t(
          "Online payment was cancelled. You can retry or switch to cash payment.",
          "Le paiement en ligne a ete annule. Vous pouvez reessayer ou choisir le paiement en especes.",
        ),
      )
      setStep("payment")
    }
  }, [t])

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("Your cart is empty", "Votre panier est vide")}</h1>
          <Link href="/products">
            <Button>{t("Continue Shopping", "Continuer mes achats")}</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.fullName &&
      formData.phone &&
      formData.governorate &&
      formData.city &&
      formData.address &&
      formData.postalCode
    ) {
      setStep("payment")
    }
  }

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        t("Geolocation is not supported by this browser.", "La geolocalisation n'est pas prise en charge par ce navigateur."),
      )
      return
    }

    setIsLocating(true)
    setShippingMode("current-location")
    setLocationMessage(
      t("Detecting your current location...", "Detection de votre position actuelle..."),
    )

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch("/api/location/reverse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          })

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as { message?: string } | null
            throw new Error(
              payload?.message ??
                t("Could not convert your location into an address.", "Impossible de convertir votre position en adresse."),
            )
          }

          const payload = (await response.json()) as {
            address: string
            city: string
            governorate: string
            postalCode: string
          }

          setFormData((prev) => ({
            ...prev,
            address: payload.address,
            city: payload.city,
            governorate: payload.governorate,
            postalCode: payload.postalCode,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))

          setLocationMessage(
            t("Current location applied.", "Position actuelle appliquee."),
          )
        } catch (error) {
          setLocationMessage(
            error instanceof Error
              ? error.message
              : t("Could not use your current location.", "Impossible d'utiliser votre position actuelle."),
          )
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? t("Location access was denied.", "L'acces a la position a ete refuse.")
            : t("Could not detect your current location.", "Impossible de detecter votre position actuelle.")

        setLocationMessage(message)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    )
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hasStockIssues) {
      setSubmitError(
        t(
          "Some items are no longer available in the requested quantity.",
          "Certains articles ne sont plus disponibles dans la quantite demandee.",
        ),
      )
      return
    }
    setStep("confirm")
  }

  const handlePlaceOrder = async () => {
    if (hasStockIssues) {
      setSubmitError(
        t(
          "Some items are no longer available in the requested quantity.",
          "Certains articles ne sont plus disponibles dans la quantite demandee.",
        ),
      )
      return
    }

    setIsProcessing(true)
    setSubmitError("")

    try {
      const normalizedPhone = normalizePhone(formData.phone)
      let userId: number | undefined

      if (currentAccount.mode === "authenticated") {
        userId = undefined
      } else {
        userId = await ensureGuestUser({
          fullName: formData.fullName,
          phone: normalizedPhone,
        })
      }

      const requestHeaders = {
        "Content-Type": "application/json",
        ...(currentAccount.mode === "guest"
          ? { "x-guest-session-id": currentAccount.guestSessionId }
          : {}),
      }
      const orderPayload = {
        userId,
        telephone: normalizedPhone,
        total: finalTotal,
        shippingAddress: {
          latitude: formData.latitude,
          longitude: formData.longitude,
          country: "Tunisia",
          city: formData.city,
          street: formData.address,
          postalCode: formData.postalCode,
        },
        items: items.map((item) => ({
          productId: Number(item.productId),
          quantite: item.quantity,
        })),
      }

      if (paymentMethod === "online") {
        const checkoutSessionResponse = await fetch("/api/payments/stripe/checkout-session", {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({
            ...orderPayload,
            deliveryFee,
          }),
        })

        if (!checkoutSessionResponse.ok) {
          const payload = (await checkoutSessionResponse.json().catch(() => null)) as { message?: string } | null
          throw new Error(payload?.message ?? "Could not start Stripe checkout")
        }

        const checkoutSession = (await checkoutSessionResponse.json()) as { checkoutUrl: string | null }

        if (!checkoutSession.checkoutUrl) {
          throw new Error("Stripe checkout URL is missing")
        }

        window.location.href = checkoutSession.checkoutUrl
        return
      }

      const createOrderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          ...orderPayload,
          status: StatusCommande.CONFIRMER,
          paymentMethod: PaymentMethod.CACHE,
        }),
      })

      if (!createOrderResponse.ok) {
        const payload = (await createOrderResponse.json().catch(() => null)) as { message?: string } | null
        throw new Error(payload?.message ?? "Could not create order")
      }

      const createdOrder = (await createOrderResponse.json()) as ApiOrder

      addOrder({
        id: String(createdOrder.id),
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: total,
        deliveryFee,
        total: finalTotal,
        status: "confirmed",
        customerName: formData.fullName,
        phone: normalizedPhone,
        address: formData.address,
        city: formData.city,
        governorate: formData.governorate,
        paymentMethod: "cash",
        createdAt: new Date(createdOrder.createdAt),
      })

      clearCart()
      router.push(`/order-confirmation`)
    } catch (error) {
      console.error("Order placement failed:", error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : t("Could not place your order right now.", "Impossible de valider votre commande pour le moment."),
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">{t("Checkout", "Paiement")}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {(["shipping", "payment", "confirm"] as const).map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step === s
                          ? "bg-primary text-primary-foreground"
                          : (
                                ["shipping", "payment", "confirm"].indexOf(s) <
                                  ["shipping", "payment", "confirm"].indexOf(step)
                              )
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-foreground"
                      }`}
                    >
                      {["shipping", "payment", "confirm"].indexOf(s) < ["shipping", "payment", "confirm"].indexOf(step)
                        ? "✓"
                        : i + 1}
                    </div>
                    <span className="ml-3 font-medium">
                      {s === "shipping"
                        ? t("Shipping", "Livraison")
                        : s === "payment"
                          ? t("Payment", "Paiement")
                          : t("Confirm", "Confirmer")}
                    </span>
                    {i < 2 && <div className="flex-1 h-1 mx-4 bg-muted" />}
                  </div>
                ))}
              </div>

              {/* Shipping Info Step */}
              {step === "shipping" && (
                <form onSubmit={handleShippingSubmit} className="space-y-6 bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold">{t("Shipping Information", "Informations de livraison")}</h2>

                  <div className="space-y-4 rounded-xl border border-border bg-background/60 p-4">
                    <div>
                      <p className="text-sm font-semibold">{t("Address input method", "Methode de saisie de l'adresse")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "Choose either your current location or manual address entry.",
                          "Choisissez soit votre position actuelle, soit la saisie manuelle de l'adresse.",
                        )}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/40">
                        <input
                          type="radio"
                          name="shipping-mode"
                          value="manual"
                          checked={shippingMode === "manual"}
                          onChange={() => {
                            setShippingMode("manual")
                            setLocationMessage("")
                            setFormData((prev) => ({
                              ...prev,
                              latitude: undefined,
                              longitude: undefined,
                            }))
                          }}
                          className="mt-1 h-4 w-4"
                        />
                        <div>
                          <p className="font-semibold">{t("Fill address manually", "Remplir l'adresse manuellement")}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("Type the delivery address yourself.", "Saisissez vous-meme l'adresse de livraison.")}
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/40">
                        <input
                          type="radio"
                          name="shipping-mode"
                          value="current-location"
                          checked={shippingMode === "current-location"}
                          onChange={() => {
                            void handleUseCurrentLocation()
                          }}
                          className="mt-1 h-4 w-4"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{t("Use my current location", "Utiliser ma position actuelle")}</p>
                          <p className="text-sm text-muted-foreground">
                            {t(
                              "We will try to detect and fill your address automatically.",
                              "Nous essaierons de detecter et remplir votre adresse automatiquement.",
                            )}
                          </p>
                        </div>
                      </label>
                    </div>

                    {locationMessage ? (
                      <p className="text-sm text-muted-foreground">{locationMessage}</p>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t("Full Name *", "Nom complet *")}</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={t("Your full name", "Votre nom complet")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t("Phone Number *", "Telephone *")}</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+216 XX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t("Governorate *", "Gouvernorat *")}</label>
                      <select
                        required
                        value={formData.governorate}
                        onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                        disabled={shippingMode === "current-location" && isLocating}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">{t("Select a governorate", "Selectionner un gouvernorat")}</option>
                        {GOVERNORATES.map((gov) => (
                          <option key={gov} value={gov}>
                            {gov}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t("City *", "Ville *")}</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={shippingMode === "current-location" && isLocating}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={t("City name", "Nom de la ville")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t("Postal Code *", "Code postal *")}</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      disabled={shippingMode === "current-location" && isLocating}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t("Postal code", "Code postal")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t("Address *", "Adresse *")}</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={shippingMode === "current-location" && isLocating}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t("Street address", "Adresse de la rue")}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    {t("Continue to Payment", "Continuer vers le paiement")}
                  </Button>
                </form>
              )}

              {/* Payment Step */}
              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6 bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold">{t("Delivery & Payment", "Livraison et paiement")}</h2>

                  {/* Delivery Options */}
                  <div>
                    <h3 className="font-semibold mb-4">{t("Delivery Option", "Option de livraison")}</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={deliveryOption === "standard"}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4">
                          <p className="font-semibold">{t("Standard Delivery - 24h", "Livraison standard - 24h")}</p>
                          <p className="text-sm text-muted-foreground">8.5 TND</p>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="radio"
                          name="delivery"
                          value="sameday"
                          checked={deliveryOption === "sameday"}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4">
                          <p className="font-semibold">{t("Same-Day Delivery (Major Cities)", "Livraison le jour meme (grandes villes)")}</p>
                          <p className="text-sm text-muted-foreground">15.0 TND</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="font-semibold mb-4">{t("Payment Method", "Methode de paiement")}</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-primary border-2 rounded-lg cursor-pointer bg-primary/5">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4">
                          <p className="font-semibold">{t("Cash on Delivery", "Paiement en especes")}</p>
                          <p className="text-sm text-muted-foreground">{t("Pay when your order arrives", "Payer a la reception de la commande")}</p>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={paymentMethod === "online"}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4">
                          <p className="font-semibold">{t("Online Payment", "Paiement en ligne")}</p>
                          <p className="text-sm text-muted-foreground">{t("Secure card payment via Stripe in EUR", "Paiement securise par carte via Stripe en EUR")}</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="flex-1 bg-transparent"
                      onClick={() => setStep("shipping")}
                    >
                      {t("Back", "Retour")}
                    </Button>
                    <Button type="submit" size="lg" className="flex-1">
                      {t("Review Order", "Verifier la commande")}
                    </Button>
                  </div>
                </form>
              )}

              {/* Confirmation Step */}
              {step === "confirm" && (
                <div className="space-y-6 bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold">{t("Order Summary", "Resume de commande")}</h2>
                  {hasStockIssues ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      {stockIssues.map((issue, index) => (
                        <p key={`${issue}-${index}`}>{issue}</p>
                      ))}
                    </div>
                  ) : null}

                  {/* Shipping Summary */}
                  <div className="border-b border-border pb-6">
                    <h3 className="font-semibold mb-3">{t("Shipping Address", "Adresse de livraison")}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{formData.fullName}</p>
                    <p className="text-sm text-muted-foreground mb-1">{formData.phone}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.address}, {formData.city}, {formData.governorate}, {formData.postalCode}
                    </p>
                  </div>

                  {/* Items Summary */}
                  <div className="border-b border-border pb-6">
                    <h3 className="font-semibold mb-3">{t("Items", "Articles")}</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>{(item.price * item.quantity).toFixed(2)} TND</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method Summary */}
                  <div className="border-b border-border pb-6">
                    <h3 className="font-semibold mb-3">{t("Payment Method", "Methode de paiement")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === "cash"
                        ? t("Cash on Delivery", "Paiement en especes")
                        : t("Online Payment (charged in EUR)", "Paiement en ligne (debite en EUR)")}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="flex-1 bg-transparent"
                      onClick={() => setStep("payment")}
                      disabled={isProcessing}
                    >
                      {t("Back", "Retour")}
                    </Button>
                    <Button size="lg" className="flex-1" onClick={handlePlaceOrder} disabled={isProcessing || hasStockIssues}>
                      {isProcessing
                        ? t("Processing...", "Traitement...")
                        : paymentMethod === "online"
                          ? t("Pay Online", "Payer en ligne")
                          : t("Place Order", "Valider la commande")}
                    </Button>
                  </div>
                  {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="sticky top-20 h-fit">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-bold">{t("Order Total", "Total de commande")}</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Subtotal", "Sous-total")}</span>
                    <span>{total.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Delivery", "Livraison")}</span>
                    <span>{deliveryFee.toFixed(2)} TND</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>{t("Total", "Total")}</span>
                    <span className="text-primary">{finalTotal.toFixed(2)} TND</span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-3 text-sm">{t("Items", "Articles")} ({items.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.productId} className="text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span className="truncate">{item.name}</span>
                          <span className="ml-2 flex-shrink-0">{item.quantity}×</span>
                        </div>
                        <div className="text-foreground font-medium">
                          {(item.price * item.quantity).toFixed(2)} TND
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Back to Cart */}
                <Link href="/cart">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    {t("Back to Cart", "Retour au panier")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
