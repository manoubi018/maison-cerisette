import { productService } from "@/features/products/service"
import { productValidator } from "@/features/products/validator"
import { handleApi } from "@/lib/middlewares/api-handler"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const products = await productService.getProducts()
    return { data: products }
  })
}

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = await request.json()
    const input = productValidator.validateCreateProduct(body)
    const product = await productService.createProduct(input)
    return { data: product, status: 201 }
  })
}
