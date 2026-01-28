"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionFromAiDto = exports.ParseTransactionResponseDto = exports.ParsedTransactionDto = exports.ParseTransactionDto = exports.UserContextDataDto = exports.CategoryInfoDto = exports.WalletInfoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class WalletInfoDto {
    id;
    name;
    type;
    balance;
}
exports.WalletInfoDto = WalletInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WalletInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ví hàng ngày' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WalletInfoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CASH' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WalletInfoDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000 }),
    __metadata("design:type", Number)
], WalletInfoDto.prototype, "balance", void 0);
class CategoryInfoDto {
    id;
    name;
    type;
}
exports.CategoryInfoDto = CategoryInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Xăng xe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryInfoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EXPENSE', enum: ['INCOME', 'EXPENSE', 'TRANSFER'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryInfoDto.prototype, "type", void 0);
class UserContextDataDto {
    wallets;
    categories;
}
exports.UserContextDataDto = UserContextDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [WalletInfoDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WalletInfoDto),
    __metadata("design:type", Array)
], UserContextDataDto.prototype, "wallets", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CategoryInfoDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategoryInfoDto),
    __metadata("design:type", Array)
], UserContextDataDto.prototype, "categories", void 0);
class ParseTransactionDto {
    text;
    user_data;
}
exports.ParseTransactionDto = ParseTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Natural language text describing the transaction',
        example: 'Đổ xăng hết 19K, ghi vào ví Hàng ngày',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ParseTransactionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "User's wallets and categories for context",
        type: UserContextDataDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UserContextDataDto),
    __metadata("design:type", UserContextDataDto)
], ParseTransactionDto.prototype, "user_data", void 0);
class ParsedTransactionDto {
    type;
    amount;
    description;
    wallet_name;
    category_name;
    note;
    confidence;
}
exports.ParsedTransactionDto = ParsedTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EXPENSE', enum: ['INCOME', 'EXPENSE', 'TRANSFER'] }),
    __metadata("design:type", String)
], ParsedTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 19000 }),
    __metadata("design:type", Number)
], ParsedTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'đổ xăng' }),
    __metadata("design:type", String)
], ParsedTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ví hàng ngày' }),
    __metadata("design:type", String)
], ParsedTransactionDto.prototype, "wallet_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Xăng xe' }),
    __metadata("design:type", String)
], ParsedTransactionDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: null }),
    __metadata("design:type", String)
], ParsedTransactionDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.95 }),
    __metadata("design:type", Number)
], ParsedTransactionDto.prototype, "confidence", void 0);
class ParseTransactionResponseDto {
    success;
    data;
    error;
    message;
}
exports.ParseTransactionResponseDto = ParseTransactionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ParseTransactionResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ParsedTransactionDto }),
    __metadata("design:type", ParsedTransactionDto)
], ParseTransactionResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: null }),
    __metadata("design:type", String)
], ParseTransactionResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Transaction parsed successfully' }),
    __metadata("design:type", String)
], ParseTransactionResponseDto.prototype, "message", void 0);
class CreateTransactionFromAiDto {
    text;
    walletId;
    categoryId;
}
exports.CreateTransactionFromAiDto = CreateTransactionFromAiDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Natural language text describing the transaction',
        example: 'Đổ xăng hết 19K, ghi vào ví Hàng ngày',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransactionFromAiDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Wallet ID to use (if not specified, AI will try to find from wallet name)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionFromAiDto.prototype, "walletId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID to use (if not specified, AI will try to find or suggest)',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionFromAiDto.prototype, "categoryId", void 0);
//# sourceMappingURL=parse-transaction.dto.js.map