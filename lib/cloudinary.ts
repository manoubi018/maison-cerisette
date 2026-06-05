"use client"

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
const cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY

export async function uploadProfileImageToCloudinary(file: File) {
  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error(
      "Cloudinary configuration is incomplete. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    )
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", cloudinaryUploadPreset)

  if (cloudinaryApiKey) {
    formData.append("api_key", cloudinaryApiKey)
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  )

  const payload = (await response.json().catch(() => null)) as
    | { secure_url?: string; error?: { message?: string } }
    | null

  if (!response.ok || !payload?.secure_url) {
    const cloudinaryMessage = payload?.error?.message ?? "Could not upload image to Cloudinary"
    const normalizedMessage = cloudinaryMessage.toLowerCase()

    if (normalizedMessage.includes("signature")) {
      throw new Error(
        "Cloudinary rejected the upload because the preset is signed. Create an unsigned upload preset or add a server-side signature endpoint.",
      )
    }

    if (normalizedMessage.includes("unsigned") || normalizedMessage.includes("whitelisted")) {
      throw new Error(
        "Cloudinary rejected the upload because this preset is not allowed for unsigned browser uploads. Mark the preset as unsigned or use a server-side signed upload flow.",
      )
    }

    throw new Error(cloudinaryMessage)
  }

  return payload.secure_url
}
