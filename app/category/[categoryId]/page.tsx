import { redirect } from "next/navigation"

interface Params {
  categoryId: string
}

export default function CategoryPage({ params }: { params: Params }) {
  redirect(`/products?category=${params.categoryId}`)
}
