import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    // Global Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Database
    PrismaModule,
    // Features
    AuthModule,
    WalletsModule,
    CategoriesModule,
    TransactionsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
