import { categoryRepository } from "./repository"

export class CategoryService {
  async getCategories() {
    return categoryRepository.findActive()
  }
}

export const categoryService = new CategoryService()
