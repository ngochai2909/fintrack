// ════════════════════════════════════════════════════════════
// TRANSACTIONS MODULE
// ════════════════════════════════════════════════════════════
// NestJS module for Transactions feature
// ════════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService], // Export for use in other modules (e.g., Dashboard)
})
export class TransactionsModule {}
