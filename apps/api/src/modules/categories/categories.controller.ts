import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * CategoriesController - API endpoints for Categories
 *
 * PATTERN: Similar to WalletsController
 *
 * ALL ROUTES REQUIRE AUTHENTICATION (@UseGuards(JwtAuthGuard))
 *
 * ENDPOINTS:
 * - POST   /categories          → Create category
 * - GET    /categories          → Get all categories (user's + system defaults)
 * - GET    /categories/:id      → Get single category
 * - PATCH  /categories/:id      → Update category
 * - DELETE /categories/:id      → Delete category
 *
 * TODO: Implement all endpoints
 */
@Controller('categories')
@UseGuards(JwtAuthGuard) // All routes require authentication
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  /**
   * CREATE CATEGORY
   * POST /categories
   * Body: CreateCategoryDto
   *
   * TODO: Implement this endpoint
   */
  @Post()
  async createCategory(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.createCategory(userId, dto);
  }

  /**
   * GET ALL CATEGORIES
   * GET /categories
   *
   * Returns: User's categories + System default categories
   *
   * TODO: Implement this endpoint
   */
  @Get()
  async getCategories(@CurrentUser('id') userId: string) {
    // TODO: Call categoriesService.getCategories(userId)
    // TODO: Return result
    return this.categoriesService.getCategories(userId);
  }

  /**
   * GET CATEGORY BY ID
   * GET /categories/:id
   *
   * TODO: Implement this endpoint
   */
  @Get(':id')
  async getCategoryById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    // TODO: Call categoriesService.getCategoryById(id, userId)
    // TODO: Return result
    return this.categoriesService.getCategoryById(id, userId);
  }

  /**
   * UPDATE CATEGORY
   * PATCH /categories/:id
   * Body: UpdateCategoryDto
   *
   * TODO: Implement this endpoint
   */
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    // TODO: Call categoriesService.updateCategory(id, userId, dto)
    // TODO: Return result
    return this.categoriesService.updateCategory(id, userId, dto);
  }

  /**
   * DELETE CATEGORY
   * DELETE /categories/:id
   *
   * TODO: Implement this endpoint
   */
  @Delete(':id')
  async deleteCategory(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    // TODO: Call categoriesService.deleteCategory(id, userId)
    // TODO: Return result
    return this.categoriesService.deleteCategory(id, userId);
  }
}
