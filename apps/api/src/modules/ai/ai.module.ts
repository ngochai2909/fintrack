/**
 * AI Module - AI-powered transaction parsing
 */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000, // 30 seconds timeout for AI requests
      maxRedirects: 5,
    }),
    PrismaModule,
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService], // Export for use in other modules if needed
})
export class AiModule {}
