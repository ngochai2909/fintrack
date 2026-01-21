// ════════════════════════════════════════════════════════════
// UPDATE PROFILE DTO
// ════════════════════════════════════════════════════════════
// DTO for updating user profile information
// ════════════════════════════════════════════════════════════

import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  /**
   * First name
   */
  @IsOptional()
  @IsString()
  firstName?: string;

  /**
   * Last name
   */
  @IsOptional()
  @IsString()
  lastName?: string;

  /**
   * Avatar URL
   */
  @IsOptional()
  @IsString()
  avatar?: string;
}
