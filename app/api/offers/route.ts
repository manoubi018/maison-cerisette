import { offerService } from "@/features/offers/service"
import { offerValidator } from "@/features/offers/validator"
import { handleApi } from "@/lib/middlewares/api-handler"

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const offers = await offerService.getOffers()
    return { data: offers }
  })
}

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = await request.json()
    const input = offerValidator.validateCreateOffer(body)
    const offer = await offerService.createOffer(input)
    return { data: offer, status: 201 }
  })
}
