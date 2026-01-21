// ════════════════════════════════════════════════════════════
// CATEGORIES SERVICE
// ════════════════════════════════════════════════════════════
// Service layer for Categories API calls
// Uses axiosInstance (auto token attachment & refresh)
// ════════════════════════════════════════════════════════════

import { axiosInstance } from '@/lib/axios';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/category';

/**
 * Categories Service
 * Handles all API calls related to categories
 * 
 * API Endpoints:
 * - GET    /api/categories          - Get all categories (user's + system defaults)
 * - POST   /api/categories          - Create new category
 * - GET    /api/categories/:id      - Get category by ID
 * - PATCH  /api/categories/:id      - Update category
 * - DELETE /api/categories/:id      - Delete category
 */
class CategoriesService {
  private readonly baseUrl = '/categories';

  /**
   * Get all categories (user's + system defaults)
   * @returns Array of categories, ordered by type and name
   */
  async getAll(): Promise<Category[]> {
    return axiosInstance.get(this.baseUrl);
  }

  /**
   * Get category by ID
   * @param id - Category UUID
   * @returns Category object
   */
  async getById(id: string): Promise<Category> {
    return axiosInstance.get(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new category
   * @param data - Category data (name, type, icon, color)
   * @returns Created category
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    return axiosInstance.post(this.baseUrl, data);
  }

  /**
   * Update an existing category
   * @param id - Category UUID
   * @param data - Updated category data
   * @returns Updated category
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return axiosInstance.patch(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete a category
   * @param id - Category UUID
   * @returns Void (no content)
   */
  async delete(id: string): Promise<void> {
    return axiosInstance.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const categoriesService = new CategoriesService();
