import { z } from "zod"

import { HttpError } from "@/lib/errors/http-error"
import { handleApi } from "@/lib/middlewares/api-handler"

const reverseLocationSchema = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
})

type NominatimResponse = {
  display_name?: string
  address?: {
    city?: string
    city_district?: string
    town?: string
    village?: string
    county?: string
    state?: string
    state_district?: string
    region?: string
    postcode?: string
    road?: string
    house_number?: string
    suburb?: string
  }
}

function normalizeGovernorate(value?: string) {
  if (!value) {
    return ""
  }

  return value
    .replace(/^ولاية\s*/u, "")
    .replace(/^Governorat(?:e)?\s+/i, "")
    .trim()
}

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const { latitude, longitude } = reverseLocationSchema.parse(await request.json())

    const url = new URL("https://nominatim.openstreetmap.org/reverse")
    url.searchParams.set("format", "jsonv2")
    url.searchParams.set("lat", String(latitude))
    url.searchParams.set("lon", String(longitude))
    url.searchParams.set("addressdetails", "1")

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "maison-cerisette-checkout/1.0",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new HttpError(502, "Could not reverse geocode the current location")
    }

    const payload = (await response.json()) as NominatimResponse
    const address = payload.address ?? {}
    const roadLine = [address.house_number, address.road, address.suburb]
      .filter(Boolean)
      .join(" ")
      .trim()

    return {
      data: {
        address: roadLine || payload.display_name || "",
        city:
          address.city ||
          address.town ||
          address.village ||
          address.city_district ||
          address.county ||
          "",
        governorate: normalizeGovernorate(
          address.state || address.state_district || address.region || address.county,
        ),
        postalCode: address.postcode || "",
      },
    }
  })
}
