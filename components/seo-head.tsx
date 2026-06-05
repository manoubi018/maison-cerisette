import type { Metadata } from "next"

export function generateSeafreshMetadata(title: string, description: string, path = "/"): Metadata {
  const baseUrl = "https://maison-cerisette.tn"
  const fullUrl = `${baseUrl}${path}`

  return {
    title: `${title} - Maison Cerisette`,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      type: "website",
      siteName: "Maison Cerisette",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
