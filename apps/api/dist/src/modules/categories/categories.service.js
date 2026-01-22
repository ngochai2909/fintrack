"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(userId, dto) {
        const existingCat = await this.prisma.category.findFirst({
            where: {
                name: dto.name,
                type: dto.type,
            },
        });
        if (existingCat) {
            throw new common_1.ConflictException('Category with this name and type already exists');
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
    async getCategories(userId) {
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
    async getCategoryById(categoryId, userId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.userId !== null && category.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this category');
        }
        return category;
    }
    async updateCategory(categoryId, userId, dto) {
        const category = await this.getCategoryById(categoryId, userId);
        if (category.userId === null) {
            throw new common_1.ForbiddenException('Cannot update system default category');
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
                throw new common_1.ConflictException(`Category "${dto.name}" already exists for this type`);
            }
        }
        return this.prisma.category.update({
            where: { id: categoryId },
            data: dto,
        });
    }
    async deleteCategory(categoryId, userId) {
        const category = await this.getCategoryById(categoryId, userId);
        if (category.userId === null) {
            throw new common_1.ForbiddenException('Cannot delete default category');
        }
        const transactionCount = await this.prisma.transaction.count({
            where: { categoryId },
        });
        if (transactionCount > 0) {
            throw new common_1.ConflictException(`Cannot delete category. It is being used by ${transactionCount} transaction(s). Please reassign or delete those transactions first.`);
        }
        await this.prisma.category.delete({
            where: {
                id: categoryId,
            },
        });
        return {
            message: 'delete successfully',
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map