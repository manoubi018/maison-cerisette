import { offerService } from "@/features/offers/service"
import { offerValidator } from "@/features/offers/validator"
import { handleApi } from "@/lib/middlewares/api-handler"

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = await request.json()
    const input = offerValidator.validateApplyOffer(body)
    const relation = await offerService.applyOfferToProduct(input)
    return { data: relation, status: 201 }
  })
}
