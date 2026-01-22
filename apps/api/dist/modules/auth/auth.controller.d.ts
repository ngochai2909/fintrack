import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(userId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
