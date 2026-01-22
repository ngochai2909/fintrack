import { axiosInstance } from '@/lib/axios';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/category';

class CategoriesService {
  private readonly baseUrl = '/categories';

  async getAll(): Promise<Category[]> {
    return axiosInstance.get(this.baseUrl);
  }

  async getById(id: string): Promise<Category> {
    return axiosInstance.get(`${this.baseUrl}/${id}`);
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    return axiosInstance.post(this.baseUrl, data);
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return axiosInstance.patch(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return axiosInstance.delete(`${this.baseUrl}/${id}`);
  }
}

export const categoriesService = new CategoriesService();
