import { dbClient } from "@/lib/db/client"

type EmailVerificationRow = {
  id: number
  email: string
  token_hash: string
  verified: boolean
  expires_at: string
  verified_at: string | null
  created_at: string
  updated_at: string
}

export interface EmailVerificationRequest {
  id: number
  email: string
  tokenHash: string
  verified: boolean
  expiresAt: string
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
}

function mapRequest(row: EmailVerificationRow): EmailVerificationRequest {
  return {
    id: Number(row.id),
    email: row.email,
    tokenHash: row.token_hash,
    verified: Boolean(row.verified),
    expiresAt: row.expires_at,
    verifiedAt: row.verified_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class EmailVerificationRepository {
  async findByEmail(email: string) {
    const row = await dbClient.query<EmailVerificationRow | null>({
      table: "email_verification_requests",
      method: "select",
      select: "*",
      filters: { email },
      single: true,
    })

    return row ? mapRequest(row) : null
  }

  async findByTokenHash(tokenHash: string) {
    const row = await dbClient.query<EmailVerificationRow | null>({
      table: "email_verification_requests",
      method: "select",
      select: "*",
      filters: { token_hash: tokenHash },
      single: true,
    })

    return row ? mapRequest(row) : null
  }

  async save(input: {
    email: string
    tokenHash: string
    verified: boolean
    expiresAt: string
    verifiedAt: string | null
  }) {
    const now = new Date().toISOString()
    const existing = await this.findByEmail(input.email)

    if (existing) {
      const rows = await dbClient.query<EmailVerificationRow[]>({
        table: "email_verification_requests",
        method: "update",
        filters: { id: existing.id },
        body: {
          token_hash: input.tokenHash,
          verified: input.verified,
          expires_at: input.expiresAt,
          verified_at: input.verifiedAt,
          updated_at: now,
        },
      })

      return mapRequest(rows[0])
    }

    const rows = await dbClient.query<EmailVerificationRow[]>({
      table: "email_verification_requests",
      method: "insert",
      body: {
        email: input.email,
        token_hash: input.tokenHash,
        verified: input.verified,
        expires_at: input.expiresAt,
        verified_at: input.verifiedAt,
        updated_at: now,
      },
    })

    return mapRequest(rows[0])
  }
}

export const emailVerificationRepository = new EmailVerificationRepository()
