import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Body,
  Get,
} from '@nestjs/common';
import { OcrService } from './ocr.service';
import { Express } from 'express';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecognizeInput } from './dtos/RecognizeInput';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadValidator } from 'src/validators/FileUploadValidator';
import { RecognizeDto } from './dtos/RecognizeDto';
import { BaseController } from 'src/bases/BaseController';
import { mapToFileDto } from 'src/utils/mapToFileDto';
import { AllowAnonymous } from 'src/guards/allowAnonymousKey.decorator';
import { ImageInput } from 'src/dtos/ImageInput';
import { Rectangle } from './dtos/Rectangle';

@Controller('ocr')
@ApiTags('OCR')
export class OcrController extends BaseController {
  constructor(private readonly ocrService: OcrService) {
    super();
  }

  @Post('recognize')
  @ApiOperation({ summary: '识别', description: '返回OCR识别结果' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 3, // 3M
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image',
    type: ImageInput,
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully recognized.',
    type: RecognizeDto,
  })
  async recognize(
    @Query() input: RecognizeInput,
    @UploadedFile(
      new FileUploadValidator(1024 * 1024 * 3, ['image/jpeg', 'image/png']),
    )
    file: Express.Multer.File,
    @Body() { rectangle }: { rectangle?: Rectangle },
  ): Promise<RecognizeDto> {
    const langs = Array.isArray(input.langs)
      ? input.langs
      : input.langs.split('+').filter((x) => !!x);
    const result = await this.ocrService.recognizeImage(
      langs,
      file.buffer,
      rectangle,
    );

    console.log('rectangle', rectangle);
    console.log('originalname', file.originalname);
    return <RecognizeDto>{
      file: mapToFileDto(file),
      ...result,
      // input: input,
    };
  }

  @Get('langs')
  @ApiOperation({ summary: 'OCR支持的语言', description: '返回OCR语言' })
  @AllowAnonymous() // 允许匿名访问
  getLangs() {
    return this.ocrService.languages;
  }
}
