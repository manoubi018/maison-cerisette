export interface UserSession {
  id: number
  userId: number
  tokenHash: string
  createdAt: string
  lastSeenAt: string
  expiresAt: string
  revokedAt: string | null
}
