import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(userId: string, dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.TransactionType;
        color: string | null;
        icon: string | null;
        userId: string | null;
        isDefault: boolean;
    }>;
    getCategories(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.TransactionType;
        color: string | null;
        icon: string | null;
        userId: string | null;
        isDefault: boolean;
    }[]>;
    getCategoryById(categoryId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.TransactionType;
        color: string | null;
        icon: string | null;
        userId: string | null;
        isDefault: boolean;
    }>;
    updateCategory(categoryId: string, userId: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.TransactionType;
        color: string | null;
        icon: string | null;
        userId: string | null;
        isDefault: boolean;
    }>;
    deleteCategory(categoryId: string, userId: string): Promise<{
        message: string;
    }>;
}
