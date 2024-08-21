import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from '../api-key/api-key.guard';
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard, // 默认应用 API Key 守卫
    },
    OcrService,
  ],
  controllers: [OcrController],
})
export class OcrModule {}
