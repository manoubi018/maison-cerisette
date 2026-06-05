import { categoryService } from "@/features/categories/service"
import { handleApi } from "@/lib/middlewares/api-handler"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const categories = await categoryService.getCategories()
    return { data: categories }
  })
}
