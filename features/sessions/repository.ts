import { dbClient } from "@/lib/db/client"

import type { UserSession } from "./types"

type UserSessionRow = {
  id: number
  user_id: number
  token_hash: string
  created_at: string
  last_seen_at: string
  expires_at: string
  revoked_at: string | null
}

function mapSession(row: UserSessionRow): UserSession {
  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    tokenHash: row.token_hash,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
  }
}

export class UserSessionRepository {
  async create(input: { userId: number; tokenHash: string; expiresAt: string }) {
    const rows = await dbClient.query<UserSessionRow[]>({
      table: "user_sessions",
      method: "insert",
      body: {
        user_id: input.userId,
        token_hash: input.tokenHash,
        expires_at: input.expiresAt,
      },
    })

    return rows[0] ? mapSession(rows[0]) : null
  }

  async findByTokenHash(tokenHash: string) {
    const row = await dbClient.query<UserSessionRow | null>({
      table: "user_sessions",
      method: "select",
      select: "*",
      filters: { token_hash: tokenHash },
      single: true,
    })

    return row ? mapSession(row) : null
  }

  async touch(id: number) {
    const rows = await dbClient.query<UserSessionRow[]>({
      table: "user_sessions",
      method: "update",
      filters: { id },
      body: {
        last_seen_at: new Date().toISOString(),
      },
    })

    return rows[0] ? mapSession(rows[0]) : null
  }

  async revoke(id: number) {
    const rows = await dbClient.query<UserSessionRow[]>({
      table: "user_sessions",
      method: "update",
      filters: { id },
      body: {
        revoked_at: new Date().toISOString(),
      },
    })

    return rows[0] ? mapSession(rows[0]) : null
  }

  async revokeAllForUser(userId: number) {
    await dbClient.query<UserSessionRow[]>({
      table: "user_sessions",
      method: "update",
      filters: { user_id: userId },
      body: {
        revoked_at: new Date().toISOString(),
      },
    })
  }
}

export const userSessionRepository = new UserSessionRepository()
