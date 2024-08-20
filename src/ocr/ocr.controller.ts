import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Query,
} from '@nestjs/common';
import { OcrService } from './ocr.service';
import { Express } from 'express';
import { createWorker } from 'tesseract.js';
// import { RecognizeDto } from './dtos/RecognizeDto';
import { ApiKeyGuard } from '../api-key/api-key.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RecognizeInput } from './dtos/RecognizeInput';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/dtos/FileUploadDto';
import { FileUploadValidator } from 'src/validators/FileUploadValidator';

@Controller('ocr')
@ApiTags('ocrs')
@ApiSecurity('api-key') // 将 API Key 鉴权配置到 Swagger 文档中
@ApiHeader({
  name: 'x-api-key',
  description: '123',
})
@UseGuards(ApiKeyGuard)
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('recognize')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image',
    type: FileUploadDto,
  })
  async recognize(
    @Query() input: RecognizeInput,
    @UploadedFile(
      // new ParseFilePipeBuilder()
      //   .addFileTypeValidator({
      //     fileType: 'png',
      //   })
      //   .addMaxSizeValidator({
      //     maxSize: 1024 * 1024, // 1M
      //   })
      //   .build(),
      new FileUploadValidator(1024 * 1024, ['image/jpeg', 'image/png']),
    )
    file: Express.Multer.File,
  ) {
    const worker = await createWorker(
      [
        // 'eng',
        'chi_sim',
        //  'chi_tra',
      ],
      1,
      {
        logger: (m) => {
          console.log(`worker ${m.workerId} - ${m.jobId} progress`, m.progress);
        },
      },
    );
    const { data } = await worker.recognize(file.buffer);

    const words = data.words.map((word) => ({
      text: word.text,
      bbox: word.bbox,
    }));

    return {
      text: data.text,
      words,
      input: input,
      fileSize: file.size,
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: RecognizeInput,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }
}
