import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create new category for user
   */
  async createCategory(userId: string, dto: CreateCategoryDto) {
    const existingCat = await this.prisma.category.findFirst({
      where: {
        name: dto.name,
        type: dto.type,
      },
    });
    
    if (existingCat) {
      throw new ConflictException(
        'Category with this name and type already exists',
      );
    }
    
    return this.prisma.category.create({
      data: {
        name: dto.name,
        type: dto.type,
        icon: dto.icon,
        color: dto.color || '#6B7280',
        userId: userId,
      },
    });
  }

  /**
   * Get all categories (user's custom + system defaults)
   */
  async getCategories(userId: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        OR: [
          { userId },
          { userId: null, isDefault: true },
        ],
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    return categories;
  }

  /**
   * Get category by ID with ownership check
   */
  async getCategoryById(categoryId: string, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    if (category.userId !== null && category.userId !== userId) {
      throw new ForbiddenException('You do not have access to this category');
    }
    
    return category;
  }

  /**
   * Update category (cannot update system defaults)
   */
  async updateCategory(
    categoryId: string,
    userId: string,
    dto: UpdateCategoryDto,
  ) {
    const category = await this.getCategoryById(categoryId, userId);

    if (category.userId === null) {
      throw new ForbiddenException('Cannot update system default category');
    }

    if (dto.name) {
      const existing = await this.prisma.category.findFirst({
        where: {
          userId,
          type: dto.type || category.type,
          name: dto.name,
          id: { not: categoryId },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Category "${dto.name}" already exists for this type`,
        );
      }
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: dto,
    });
  }

  /**
   * Delete category (prevents deletion if has transactions)
   */
  async deleteCategory(categoryId: string, userId: string) {
    const category = await this.getCategoryById(categoryId, userId);
    
    if (category.userId === null) {
      throw new ForbiddenException('Cannot delete default category');
    }

    const transactionCount = await this.prisma.transaction.count({
      where: { categoryId },
    });

    if (transactionCount > 0) {
      throw new ConflictException(
        `Cannot delete category. It is being used by ${transactionCount} transaction(s). Please reassign or delete those transactions first.`,
      );
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });
    
    return {
      message: 'Category deleted successfully',
    };
  }
}
