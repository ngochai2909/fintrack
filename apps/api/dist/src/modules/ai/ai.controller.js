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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const ai_service_1 = require("./ai.service");
const parse_transaction_dto_1 = require("./dto/parse-transaction.dto");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async testAiService() {
        return {
            status: 'ok',
            message: 'AI module is loaded in NestJS',
            endpoints: {
                parse: 'POST /ai/parse',
                createTransaction: 'POST /ai/transactions',
            },
        };
    }
    async parseTransaction(dto, userId) {
        return this.aiService.parseTransaction(dto);
    }
    async createTransactionFromAi(dto, userId) {
        return this.aiService.parseAndCreateTransaction(userId, dto);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Test AI service',
        description: 'Check if AI service is accessible',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "testAiService", null);
__decorate([
    (0, common_1.Post)('parse'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Parse transaction text',
        description: 'Parse natural language text into structured transaction data (without saving to database)',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parse_transaction_dto_1.ParseTransactionDto, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "parseTransaction", null);
__decorate([
    (0, common_1.Post)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create transaction from natural language',
        description: 'Parse natural language text and automatically create a transaction in the database',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parse_transaction_dto_1.CreateTransactionFromAiDto, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "createTransactionFromAi", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI - Transaction Parsing'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map