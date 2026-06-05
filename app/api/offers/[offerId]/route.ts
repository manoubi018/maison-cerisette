import { offerService } from "@/features/offers/service"
import { offerValidator } from "@/features/offers/validator"
import { HttpError } from "@/lib/errors/http-error"
import { handleApi } from "@/lib/middlewares/api-handler"

function parseOfferId(rawId: string) {
  const offerId = Number(rawId)
  if (!Number.isInteger(offerId) || offerId <= 0) {
    throw new HttpError(400, "Invalid offerId")
  }
  return offerId
}

export async function GET(
  request: Request,
  context: { params: { offerId: string } | Promise<{ offerId: string }> },
) {
  return handleApi(request, async () => {
    const { offerId: rawId } = await Promise.resolve(context.params)
    const offerId = parseOfferId(rawId)
    const offer = await offerService.getOfferById(offerId)
    return { data: offer }
  })
}

export async function PATCH(
  request: Request,
  context: { params: { offerId: string } | Promise<{ offerId: string }> },
) {
  return handleApi(request, async () => {
    const { offerId: rawId } = await Promise.resolve(context.params)
    const offerId = parseOfferId(rawId)
    const body = await request.json()
    const input = offerValidator.validateUpdateOffer(body)
    const offer = await offerService.updateOffer(offerId, input)
    return { data: offer }
  })
}

export async function DELETE(
  request: Request,
  context: { params: { offerId: string } | Promise<{ offerId: string }> },
) {
  return handleApi(request, async () => {
    const { offerId: rawId } = await Promise.resolve(context.params)
    const offerId = parseOfferId(rawId)
    await offerService.deleteOffer(offerId)
    return { data: { success: true } }
  })
}
