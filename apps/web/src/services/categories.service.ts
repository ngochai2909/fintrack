import axiosInstance from '@/lib/axios';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/category';

/**
 * CategoriesService - API calls for Categories
 * 
 * PATTERN: Similar to wallets.service.ts
 * 
 * ALL METHODS USE axiosInstance (auto-unwraps response.data)
 * 
 * ENDPOINTS:
 * - POST   /categories          → Create category
 * - GET    /categories          → Get all categories
 * - GET    /categories/:id      → Get single category
 * - PATCH  /categories/:id      → Update category
 * - DELETE /categories/:id      → Delete category
 * 
 * TODO: Implement all methods
 */
class CategoriesService {
  private readonly baseURL = '/categories';

  /**
   * GET ALL CATEGORIES
   * Returns: User's categories + System default categories
   * 
   * TODO: Implement this method
   */
  async getAll(): Promise<Category[]> {
    // TODO: Call GET /categories
    // Use: axiosInstance.get<Category[]>(this.baseURL)
    // Return: Promise<Category[]>
    throw new Error('Not implemented');
  }

  /**
   * GET CATEGORY BY ID
   * 
   * TODO: Implement this method
   */
  async getById(id: string): Promise<Category> {
    // TODO: Call GET /categories/:id
    // Use: axiosInstance.get<Category>(`${this.baseURL}/${id}`)
    // Return: Promise<Category>
    throw new Error('Not implemented');
  }

  /**
   * CREATE CATEGORY
   * 
   * TODO: Implement this method
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    // TODO: Call POST /categories
    // Use: axiosInstance.post<Category>(this.baseURL, data)
    // Return: Promise<Category>
    throw new Error('Not implemented');
  }

  /**
   * UPDATE CATEGORY
   * 
   * TODO: Implement this method
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    // TODO: Call PATCH /categories/:id
    // Use: axiosInstance.patch<Category>(`${this.baseURL}/${id}`, data)
    // Return: Promise<Category>
    throw new Error('Not implemented');
  }

  /**
   * DELETE CATEGORY
   * 
   * TODO: Implement this method
   */
  async delete(id: string): Promise<void> {
    // TODO: Call DELETE /categories/:id
    // Use: axiosInstance.delete(`${this.baseURL}/${id}`)
    // Return: Promise<void>
    throw new Error('Not implemented');
  }
}

export const categoriesService = new CategoriesService();
