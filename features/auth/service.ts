import { HttpError } from "@/lib/errors/http-error"
import { hashPassword, verifyPassword } from "@/lib/security/password"
import { guestSessionOwnsEmail } from "@/lib/security/guest-session"

import { emailVerificationService } from "@/features/auth/email-verification-service"
import { userRepository } from "@/features/users/repository"
import { Role } from "@/features/users/types"

const MAX_FAILED_LOGIN_ATTEMPTS = 5
const ACCOUNT_LOCK_DURATION_MS = 15 * 60 * 1000

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "")
}

function normalizeIdentifier(identifier: string) {
  const trimmed = identifier.trim()

  return trimmed.includes("@")
    ? { kind: "email" as const, value: normalizeEmail(trimmed) }
    : { kind: "telephone" as const, value: normalizePhone(trimmed) }
}

function isFutureDate(value: string | null) {
  return value ? new Date(value).getTime() > Date.now() : false
}

export class AuthService {
  async signIn(input: { identifier: string; password: string }) {
    const identifier = normalizeIdentifier(input.identifier)
    const account =
      identifier.kind === "email"
        ? await userRepository.findAuthByEmail(identifier.value)
        : await userRepository.findAuthByTelephone(identifier.value)

    if (!account) {
      throw new HttpError(401, "Invalid credentials")
    }

    if (account.user.role !== Role.CLIENT) {
      throw new HttpError(403, "This account is not allowed in the client application")
    }

    if (isFutureDate(account.user.lockedUntil)) {
      throw new HttpError(423, "This account is temporarily locked. Please try again later.")
    }

    const failedAttempts =
      account.user.lockedUntil && !isFutureDate(account.user.lockedUntil)
        ? 0
        : account.user.failedLoginAttempts

    if (!account.passwordHash) {
      throw new HttpError(
        403,
        "This account does not have a password yet. Open it from the original browser session to define one.",
      )
    }

    const passwordMatches = await verifyPassword(input.password, account.passwordHash)

    if (!passwordMatches) {
      const nextAttempts = failedAttempts + 1
      const lockedUntil =
        nextAttempts >= MAX_FAILED_LOGIN_ATTEMPTS
          ? new Date(Date.now() + ACCOUNT_LOCK_DURATION_MS).toISOString()
          : null

      await userRepository.updateSecurity(account.user.id, {
        failedLoginAttempts: nextAttempts,
        lockedUntil,
      })

      if (lockedUntil) {
        throw new HttpError(423, "Too many failed attempts. The account is temporarily locked.")
      }

      throw new HttpError(401, "Invalid credentials")
    }

    const signedInUser = await userRepository.updateSecurity(account.user.id, {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date().toISOString(),
    })

    if (!signedInUser) {
      throw new HttpError(500, "Could not update account security")
    }

    return signedInUser
  }

  async signUp(input: {
    fullName: string
    email: string
    phone: string
    password: string
    guestUserId?: number
    guestSessionId?: string
  }) {
    const email = normalizeEmail(input.email)
    const telephone = normalizePhone(input.phone)
    const now = new Date().toISOString()

    await emailVerificationService.assertVerified(email)

    const existingEmail = await userRepository.findByEmail(email)
    if (existingEmail && existingEmail.id !== input.guestUserId) {
      throw new HttpError(409, "Email already exists")
    }

    const existingTelephone = await userRepository.findByTelephone(telephone)
    if (existingTelephone && existingTelephone.id !== input.guestUserId) {
      throw new HttpError(409, "Phone number already exists")
    }

    const passwordHash = await hashPassword(input.password)

    if (input.guestUserId) {
      const guestAccount = await userRepository.findAuthById(input.guestUserId)

      if (!guestAccount) {
        throw new HttpError(404, "Guest account not found")
      }

      if (
        !input.guestSessionId ||
        !guestSessionOwnsEmail(input.guestSessionId, guestAccount.user.email)
      ) {
        throw new HttpError(403, "This guest account does not belong to the current browser session")
      }

      const updatedUser = await userRepository.update(input.guestUserId, {
        nom: input.fullName.trim(),
        email,
        telephone,
        isOnline: true,
        lastSeen: new Date().toISOString(),
        role: Role.CLIENT,
        emailVerifiedAt: now,
      })

      if (!updatedUser) {
        throw new HttpError(500, "Could not upgrade guest account")
      }

      const securedUser = await userRepository.setPasswordHash(input.guestUserId, passwordHash)

      if (!securedUser) {
        throw new HttpError(500, "Could not secure account")
      }

      const activeUser = await userRepository.updateSecurity(input.guestUserId, {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: now,
      })

      if (!activeUser) {
        throw new HttpError(500, "Could not finalize account security")
      }

      return activeUser
    }

    const user = await userRepository.create({
      nom: input.fullName.trim(),
      email,
      telephone,
      isOnline: true,
      lastSeen: now,
      role: Role.CLIENT,
      emailVerifiedAt: now,
      passwordHash,
    })

    if (!user) {
      throw new HttpError(500, "Could not create account")
    }

    const securedUser = await userRepository.updateSecurity(user.id, {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: now,
    })

    if (!securedUser) {
      throw new HttpError(500, "Could not finalize account security")
    }

    return securedUser
  }

  async updatePassword(input: {
    userId: number
    currentPassword?: string
    newPassword: string
  }) {
    const account = await userRepository.findAuthById(input.userId)

    if (!account) {
      throw new HttpError(404, "User not found")
    }

    if (account.passwordHash) {
      if (!input.currentPassword) {
        throw new HttpError(400, "Current password is required")
      }

      const passwordMatches = await verifyPassword(input.currentPassword, account.passwordHash)

      if (!passwordMatches) {
        throw new HttpError(401, "Current password is incorrect")
      }
    }

    const nextPasswordHash = await hashPassword(input.newPassword)
    const user = await userRepository.setPasswordHash(input.userId, nextPasswordHash)

    if (!user) {
      throw new HttpError(500, "Could not update password")
    }

    return user
  }
}

export const authService = new AuthService()
