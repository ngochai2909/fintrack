import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * CategoriesModule
 *
 * PATTERN: Same as WalletsModule
 *
 * IMPORTS: PrismaModule (for database access)
 * CONTROLLERS: CategoriesController
 * PROVIDERS: CategoriesService
 *
 * TODO: Nothing to do here - this is complete!
 */
@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // Export for use in other modules
})
export class CategoriesModule {}
