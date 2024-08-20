import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Body,
} from '@nestjs/common';
import { OcrService } from './ocr.service';
import { Express } from 'express';
import { createWorker } from 'tesseract.js';

import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecognizeInput } from './dtos/RecognizeInput';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/dtos/FileUploadDto';
import { FileUploadValidator } from 'src/validators/FileUploadValidator';
import { RecognizeDto } from './dtos/RecognizeDto';
import { BaseController } from 'src/bases/BaseController';
import { mapToFileDto } from 'src/utils/mapToFileDto';

@Controller('ocr')
@ApiTags('ocrs')
export class OcrController extends BaseController {
  constructor(private readonly ocrService: OcrService) {
    super();
  }

  @Post('recognize')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image',
    type: FileUploadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: RecognizeDto,
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
      new FileUploadValidator(1024 * 1024 * 3, ['image/jpeg', 'image/png']),
    )
    file: Express.Multer.File,
    @Body() body: any,
  ): Promise<RecognizeDto> {
    const worker = await createWorker(
      // [
      //   // 'eng',
      //   'chi_sim',
      //   //  'chi_tra',
      // ],
      input.langs,
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
    console.log('body', body);

    return <RecognizeDto>{
      file: mapToFileDto(file),
      text: data.text,
      words,
      // input: input,
    };
  }
}
