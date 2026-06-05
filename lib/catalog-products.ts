import { categories as staticCategories, products as staticProducts, type Product as StaticProduct } from "./product-data"

export const categories = staticCategories

type StaticCategory = StaticProduct["category"]
type StaticFreshness = StaticProduct["freshness"]

export interface DbProduct {
  id: number
  nom: string
  description: string | null
  prix: number
  stock: number
  unite: string
  image: string | null
  active: boolean
  createdAt: string
  categoryId: number | null
  category?: DbCategory | null
}

export interface DbCategory {
  id: number
  slug: string
  name: string
  description: string | null
  isActive: boolean
  createdAt?: string
}

export interface CatalogProduct extends StaticProduct {
  dbId: number
  stock: number
  unite: string
  active: boolean
  createdAt: string
  isNew: boolean
  originalPrice: number
  activeOffer: {
    id: number
    name: string
    price: number
    dateDebut: string
    dateFin: string
  } | null
}

export interface ActiveCatalogOffer {
  id: number
  nom: string
  dateDebut: string
  dateFin: string
  active: boolean
  nouveauPrix: number
  productId: number
}

function normalizeProductName(value: string) {
  return value.trim().toLowerCase()
}

const staticProductsByName = new Map(
  staticProducts.map((product) => [normalizeProductName(product.name), product]),
)

function getFallbackCategory(name: string): StaticCategory {
  const lowerName = name.toLowerCase()

  if (lowerName.includes("sirop") || lowerName.includes("boisson") || lowerName.includes("limonade")) {
    return "sirops"
  }

  if (lowerName.includes("chocolat") || lowerName.includes("truffe") || lowerName.includes("confiserie") || lowerName.includes("tarte")) {
    return "chocolats"
  }

  if (lowerName.includes("liqueur") || lowerName.includes("griotte") || lowerName.includes("spiritueux")) {
    return "liqueurs"
  }

  return "confitures"
}

function buildFallbackProduct(product: DbProduct): StaticProduct {
  const category = getFallbackCategory(product.nom)

  return {
    id: String(product.id),
    name: product.nom,
    category: product.category?.slug ?? category,
    price: product.prix,
    image: product.image ?? "/placeholder.svg",
    rating: 0,
    reviews: 0,
    freshness: "arrived-today" as StaticFreshness,
    origin: "",
    description: product.description ?? "",
    taste: "",
    recipes: [],
    cutOptions: [],
    storageAdvice: "",
  }
}

function isCreatedWithinFirstWeek(createdAt: string) {
  const createdTime = new Date(createdAt).getTime()

  if (Number.isNaN(createdTime)) {
    return false
  }

  const weekInMs = 7 * 24 * 60 * 60 * 1000
  const ageInMs = Date.now() - createdTime

  return ageInMs >= 0 && ageInMs <= weekInMs
}

export function mergeDbProductWithStatic(
  product: DbProduct,
  offer?: ActiveCatalogOffer,
): CatalogProduct {
  const staticProduct =
    staticProductsByName.get(normalizeProductName(product.nom)) ??
    buildFallbackProduct(product)
  const promoPrice =
    offer && offer.nouveauPrix > 0 && offer.nouveauPrix < product.prix
      ? offer.nouveauPrix
      : null
  const isNew = isCreatedWithinFirstWeek(product.createdAt)

  return {
    ...staticProduct,
    id: String(product.id),
    dbId: product.id,
    name: product.nom,
    price: promoPrice ?? product.prix,
    image: product.image ?? staticProduct.image,
    description: product.description ?? staticProduct.description,
    category: product.category?.slug ?? staticProduct.category,
    stock: product.stock,
    unite: product.unite,
    active: product.active,
    createdAt: product.createdAt,
    isNew,
    freshness: isNew ? "arrived-today" : "caught-24h",
    originalPrice: product.prix,
    activeOffer: promoPrice && offer
      ? {
          id: offer.id,
          name: offer.nom,
          price: promoPrice,
          dateDebut: offer.dateDebut,
          dateFin: offer.dateFin,
        }
      : null,
  }
}

export function mergeDbProductsWithStatic(
  products: DbProduct[],
  offers: ActiveCatalogOffer[] = [],
) {
  const offersByProductId = new Map<number, ActiveCatalogOffer>()

  for (const offer of offers) {
    const current = offersByProductId.get(offer.productId)

    if (!current || offer.nouveauPrix < current.nouveauPrix) {
      offersByProductId.set(offer.productId, offer)
    }
  }

  return products.map((product) =>
    mergeDbProductWithStatic(product, offersByProductId.get(product.id)),
  )
}

export function searchCatalogProducts(
  products: CatalogProduct[],
  query: string,
  dynamicCategories: DbCategory[] = [],
) {
  const lowerQuery = query.trim().toLowerCase()
  const categoryNames = new Map([
    ...staticCategories.map((category) => [category.id, category.name.toLowerCase()] as const),
    ...dynamicCategories.map((category) => [category.slug, category.name.toLowerCase()] as const),
  ])

  if (!lowerQuery) {
    return products
  }

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.taste.toLowerCase().includes(lowerQuery) ||
      product.origin.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      (categoryNames.get(product.category)?.includes(lowerQuery) ?? false),
  )
}

export function getTopRatedCatalogProducts(products: CatalogProduct[], limit = 6) {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export function getRelatedCatalogProducts(
  products: CatalogProduct[],
  categoryId: string,
  excludeId: string,
  limit = 4,
) {
  return products
    .filter((product) => product.category === categoryId && product.id !== excludeId)
    .slice(0, limit)
}
