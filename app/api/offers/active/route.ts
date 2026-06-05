import { offerService } from "@/features/offers/service"
import { handleApi } from "@/lib/middlewares/api-handler"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const offers = await offerService.getActiveProductOffers()
    return { data: offers }
  })
}
