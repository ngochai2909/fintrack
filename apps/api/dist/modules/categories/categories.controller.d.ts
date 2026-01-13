import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    createCategory(userId: string, dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        userId: string | null;
        isDefault: boolean;
    }>;
    getCategories(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        userId: string | null;
        isDefault: boolean;
    }[]>;
    getCategoryById(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        userId: string | null;
        isDefault: boolean;
    }>;
    updateCategory(id: string, userId: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        userId: string | null;
        isDefault: boolean;
    }>;
    deleteCategory(id: string, userId: string): Promise<{
        message: string;
    }>;
}
