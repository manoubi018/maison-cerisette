import { createHash, randomBytes, timingSafeEqual } from "node:crypto"

import { emailVerificationRepository } from "@/features/email-verifications/repository"
import { userRepository } from "@/features/users/repository"
import { HttpError } from "@/lib/errors/http-error"
import { sendVerificationEmail } from "@/lib/email/resend"

const EMAIL_VERIFICATION_TTL_MS = 15 * 60 * 1000

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

function isExpired(value: string) {
  return new Date(value).getTime() <= Date.now()
}

function getVerificationSecret() {
  const secret = process.env.EMAIL_VERIFICATION_SECRET

  if (!secret) {
    throw new HttpError(500, "Missing EMAIL_VERIFICATION_SECRET in .env.local")
  }

  return secret
}

function createSignedToken(email: string) {
  const nonce = randomBytes(32).toString("hex")
  const secret = getVerificationSecret()
  return createHash("sha256").update(`${email}:${nonce}:${secret}`).digest("hex")
}

function buildVerificationUrl(token: string, origin: string) {
  const baseUrl = process.env.EMAIL_VERIFICATION_BASE_URL?.trim() || `${origin}/verify-email`
  const separator = baseUrl.includes("?") ? "&" : "?"
  return `${baseUrl}${separator}token=${encodeURIComponent(token)}`
}

export class EmailVerificationService {
  async request(email: string, origin: string) {
    const normalizedEmail = normalizeEmail(email)
    const existingUser = await userRepository.findByEmail(normalizedEmail)

    if (existingUser?.emailVerifiedAt) {
      throw new HttpError(409, "Email already exists")
    }

    const token = createSignedToken(normalizedEmail)
    const tokenHash = hashToken(token)
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS).toISOString()

    await emailVerificationRepository.save({
      email: normalizedEmail,
      tokenHash,
      verified: false,
      expiresAt,
      verifiedAt: null,
    })

    const verificationUrl = buildVerificationUrl(token, origin)
    await sendVerificationEmail({
      to: normalizedEmail,
      verificationUrl,
    })

    return {
      email: normalizedEmail,
      verificationUrl,
      expiresAt,
    }
  }

  async getStatus(email: string) {
    const normalizedEmail = normalizeEmail(email)
    const request = await emailVerificationRepository.findByEmail(normalizedEmail)

    if (!request) {
      return {
        email: normalizedEmail,
        verified: false,
      }
    }

    return {
      email: normalizedEmail,
      verified: request.verified,
    }
  }

  async assertVerified(email: string) {
    const status = await this.getStatus(email)

    if (!status.verified) {
      throw new HttpError(400, "Please verify your email before continuing")
    }
  }

  async verifyToken(token: string) {
    const tokenHash = hashToken(token)
    const request = await emailVerificationRepository.findByTokenHash(tokenHash)

    if (!request) {
      throw new HttpError(400, "Invalid verification token")
    }

    const incomingHash = Buffer.from(tokenHash, "hex")
    const storedHash = Buffer.from(request.tokenHash, "hex")

    if (
      incomingHash.length !== storedHash.length ||
      !timingSafeEqual(incomingHash, storedHash)
    ) {
      throw new HttpError(400, "Invalid verification token")
    }

    if (request.verified) {
      return {
        email: request.email,
        message: "Email verified successfully",
      }
    }

    if (isExpired(request.expiresAt)) {
      throw new HttpError(400, "This verification link has expired")
    }

    await emailVerificationRepository.save({
      email: request.email,
      tokenHash: request.tokenHash,
      verified: true,
      expiresAt: request.expiresAt,
      verifiedAt: new Date().toISOString(),
    })

    return {
      email: request.email,
      message: "Email verified successfully",
    }
  }
}

export const emailVerificationService = new EmailVerificationService()
