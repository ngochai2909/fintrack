// ════════════════════════════════════════════════════════════
// WALLETS CONTROLLER - API Endpoints
// ════════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto, UpdateWalletDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../../common/decorators';

@Controller('wallets')
@UseGuards(JwtAuthGuard) // ← Tất cả endpoints đều cần login
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  // ────────────────────────────────────────────────────────────
  // POST /api/wallets - Tạo ví mới
  // ────────────────────────────────────────────────────────────
  @Post()
  async createWallet(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateWalletDto,
  ) {
    return this.walletsService.createWallet(userId, dto);
  }

  // ────────────────────────────────────────────────────────────
  // GET /api/wallets - Lấy tất cả ví của user
  // ────────────────────────────────────────────────────────────
  @Get()
  async getWallets(@CurrentUser('id') userId: string) {
    return this.walletsService.getWallets(userId);
  }

  // ────────────────────────────────────────────────────────────
  // GET /api/wallets/:id - Lấy chi tiết 1 ví
  // ────────────────────────────────────────────────────────────
  @Get(':id')
  async getWalletById(
    @CurrentUser('id') userId: string,
    @Param('id') walletId: string,
  ) {
    return this.walletsService.getWalletById(userId, walletId);
  }

  // ────────────────────────────────────────────────────────────
  // PATCH /api/wallets/:id - Cập nhật ví
  // ────────────────────────────────────────────────────────────
  @Patch(':id')
  async updateWallet(
    @CurrentUser('id') userId: string,
    @Param('id') walletId: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletsService.updateWallet(userId, walletId, dto);
  }

  // ────────────────────────────────────────────────────────────
  // DELETE /api/wallets/:id - Xóa ví
  // ────────────────────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteWallet(
    @CurrentUser('id') userId: string,
    @Param('id') walletId: string,
  ) {
    return this.walletsService.deleteWallet(userId, walletId);
  }
}
