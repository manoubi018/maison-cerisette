import { dbClient } from "@/lib/db/client"

import type { Category } from "./types"

type CategoryRow = {
  id: number
  slug: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: Number(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description ?? null,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  }
}

export class CategoryRepository {
  async findAll() {
    const rows = await dbClient.query<CategoryRow[]>({
      table: "categories",
      method: "select",
      select: "*",
    })

    return rows.map(mapCategory)
  }

  async findActive() {
    const rows = await dbClient.query<CategoryRow[]>({
      table: "categories",
      method: "select",
      select: "*",
      filters: { is_active: true },
    })

    return rows.map(mapCategory)
  }
}

export const categoryRepository = new CategoryRepository()
