import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { OcrService } from './ocr.service';
import { Express } from 'express';

import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecognizeInput } from './dtos/RecognizeInput';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/dtos/FileUploadDto';
import { FileUploadValidator } from 'src/validators/FileUploadValidator';
import { RecognizeDto } from './dtos/RecognizeDto';
import { BaseController } from 'src/bases/BaseController';
import { mapToFileDto } from 'src/utils/mapToFileDto';
import { PublicGuard } from 'src/guards/public.guard';
import { AllowAnonymous } from 'src/guards/allowAnonymousKey.decorator';

@Controller('ocr')
@ApiTags('ocrs')
export class OcrController extends BaseController {
  constructor(private readonly ocrService: OcrService) {
    super();
  }

  @Post('recognize')
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
    type: FileUploadDto,
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
    @Body() body: any,
  ): Promise<RecognizeDto> {
    const langs = Array.isArray(input.langs)
      ? input.langs
      : input.langs.split('+').filter((x) => !!x);
    const result = await this.ocrService.recognizeImage(langs, file.buffer);
    console.log('body', body);
    console.log('originalname', file.originalname);
    return <RecognizeDto>{
      langs,
      file: mapToFileDto(file),
      ...result,
      // input: input,
    };
  }

  @Get('langs')
  @UseGuards(PublicGuard) // 允许匿名访问
  @AllowAnonymous()
  getLangs() {
    return this.ocrService.languages;
  }
}
