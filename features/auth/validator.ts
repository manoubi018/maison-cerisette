import { z } from "zod"

const passwordSchema = z
  .string()
  .min(10, "Password must contain at least 10 characters")
  .max(128, "Password is too long")

const signInSchema = z.object({
  identifier: z.string().trim().min(3, "Identifier is required"),
  password: z.string().min(1, "Password is required"),
})

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("A valid email is required"),
  phone: z.string().trim().min(6, "Phone number is required"),
  password: passwordSchema,
  guestUserId: z.number().int().positive().optional(),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: passwordSchema,
})

const emailVerificationRequestSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
})

const emailVerificationStatusSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
})

const emailVerificationTokenSchema = z.object({
  token: z.string().trim().min(20, "Verification token is required"),
})

export class AuthValidator {
  validateSignIn(input: unknown) {
    return signInSchema.parse(input)
  }

  validateSignUp(input: unknown) {
    return signUpSchema.parse(input)
  }

  validateUpdatePassword(input: unknown) {
    return updatePasswordSchema.parse(input)
  }

  validateEmailVerificationRequest(input: unknown) {
    return emailVerificationRequestSchema.parse(input)
  }

  validateEmailVerificationStatus(input: unknown) {
    return emailVerificationStatusSchema.parse(input)
  }

  validateEmailVerificationToken(input: unknown) {
    return emailVerificationTokenSchema.parse(input)
  }
}

export const authValidator = new AuthValidator()
