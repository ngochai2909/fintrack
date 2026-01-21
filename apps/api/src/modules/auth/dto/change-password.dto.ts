// ════════════════════════════════════════════════════════════
// CHANGE PASSWORD DTO
// ════════════════════════════════════════════════════════════
// DTO for changing user password
// ════════════════════════════════════════════════════════════

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  /**
   * Current password (for verification)
   */
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  /**
   * New password (min 6 characters)
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
