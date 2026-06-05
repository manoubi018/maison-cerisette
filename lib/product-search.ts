import { categories, products } from "./product-data"

export function searchProducts(query: string) {
  const lowerQuery = query.toLowerCase()
  const categoryNames = new Map(categories.map((category) => [category.id, category.name.toLowerCase()]))
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.taste.toLowerCase().includes(lowerQuery) ||
      product.origin.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      categoryNames.get(product.category)?.includes(lowerQuery),
  )
}

export function filterProductsByPrice(minPrice: number, maxPrice: number) {
  return products.filter((p) => p.price >= minPrice && p.price <= maxPrice)
}

export function getTopRatedProducts(limit = 6) {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return products.filter((p) => p.category === categoryId && p.id !== excludeId).slice(0, limit)
}
