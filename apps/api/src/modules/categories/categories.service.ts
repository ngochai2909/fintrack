import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * CategoriesService - Business logic for Categories CRUD
 *
 * PATTERN: Similar to WalletsService
 *
 * KEY METHODS:
 * 1. createCategory - Create new category for user
 * 2. getCategories - Get all categories (user's + system defaults)
 * 3. getCategoryById - Get single category with ownership check
 * 4. updateCategory - Update category with ownership check
 * 5. deleteCategory - Delete category with ownership check
 */
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE CATEGORY
   *
   * BUSINESS LOGIC:
   * 1. Check duplicate name (same user + same type)
   * 2. Set default color if not provided (#6B7280)
   * 3. Create category with userId
   * 4. Return created category
   *
   * ERRORS:
   * - ConflictException: Duplicate name for same type
   *
   * TODO: Implement this method
   */
  async createCategory(userId: string, dto: CreateCategoryDto) {
    // TODO: Check if category with same name and type already exists for this user
    // Use: this.prisma.category.findFirst({ where: { ... } })
    // If exists, throw ConflictException

    // TODO: Create category with default color
    // Use: this.prisma.category.create({ data: { ... } })
    // Set: userId, name, type, icon, color (default: #6B7280)

    // TODO: Return created category
    throw new Error('Not implemented');
  }

  /**
   * GET ALL CATEGORIES
   *
   * BUSINESS LOGIC:
   * 1. Get user's custom categories (userId = userId)
   * 2. Get system default categories (userId = null, isDefault = true)
   * 3. Combine and return both
   * 4. Order by: isDefault DESC, createdAt DESC
   *
   * NOTE: User can see both their categories AND system defaults
   *
   * TODO: Implement this method
   */
  async getCategories(userId: string) {
    // TODO: Find all categories where:
    // - userId === userId (user's categories)
    // - OR userId === null AND isDefault === true (system defaults)
    // Use: this.prisma.category.findMany({ where: { OR: [...] } })

    // TODO: Order by isDefault DESC, then createdAt DESC

    // TODO: Return categories
    throw new Error('Not implemented');
  }

  /**
   * GET CATEGORY BY ID
   *
   * BUSINESS LOGIC:
   * 1. Find category by id
   * 2. Check if exists
   * 3. Check ownership (userId must match OR category is system default)
   * 4. Return category
   *
   * ERRORS:
   * - NotFoundException: Category not found
   * - ForbiddenException: User doesn't own this category
   *
   * NOTE: Users can access system default categories too!
   *
   * TODO: Implement this method
   */
  async getCategoryById(categoryId: string, userId: string) {
    // TODO: Find category by id
    // Use: this.prisma.category.findUnique({ where: { id: categoryId } })

    // TODO: If not found, throw NotFoundException

    // TODO: Check ownership
    // Allow if: category.userId === userId OR category.userId === null (system default)
    // If not allowed, throw ForbiddenException

    // TODO: Return category
    throw new Error('Not implemented');
  }

  /**
   * UPDATE CATEGORY
   *
   * BUSINESS LOGIC:
   * 1. Check if category exists and user owns it (reuse getCategoryById)
   * 2. If name is changing, check duplicate (same type, different id)
   * 3. Update category
   * 4. Return updated category
   *
   * ERRORS:
   * - NotFoundException: Category not found
   * - ForbiddenException: User doesn't own this category
   * - ConflictException: Duplicate name for same type
   *
   * NOTE: Cannot update system default categories!
   *
   * TODO: Implement this method
   */
  async updateCategory(
    categoryId: string,
    userId: string,
    dto: UpdateCategoryDto,
  ) {
    // TODO: Call getCategoryById to verify existence and ownership
    // Store result in a variable: const category = await this.getCategoryById(...)

    // TODO: Prevent updating system default categories
    // If category.userId === null, throw ForbiddenException('Cannot update system default category')

    // TODO: If dto.name is provided, check for duplicates
    // Use: this.prisma.category.findFirst({ where: { ... } })
    // Check: same userId, same type, same name, but different id
    // If exists, throw ConflictException

    // TODO: Update category
    // Use: this.prisma.category.update({ where: { id: categoryId }, data: dto })

    // TODO: Return updated category
    throw new Error('Not implemented');
  }

  /**
   * DELETE CATEGORY
   *
   * BUSINESS LOGIC:
   * 1. Check if category exists and user owns it (reuse getCategoryById)
   * 2. Prevent deleting system default categories
   * 3. Delete category
   * 4. Return success message
   *
   * ERRORS:
   * - NotFoundException: Category not found
   * - ForbiddenException: User doesn't own this category or it's a system default
   *
   * NOTE: This will fail if category has transactions (Prisma constraint)
   *
   * TODO: Implement this method
   */
  async deleteCategory(categoryId: string, userId: string) {
    // TODO: Call getCategoryById to verify existence and ownership

    // TODO: Prevent deleting system default categories
    // If category.userId === null, throw ForbiddenException('Cannot delete system default category')

    // TODO: Delete category
    // Use: this.prisma.category.delete({ where: { id: categoryId } })

    // TODO: Return success message
    // Example: { message: 'Category deleted successfully' }
    throw new Error('Not implemented');
  }
}
