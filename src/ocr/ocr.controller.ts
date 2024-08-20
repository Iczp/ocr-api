import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { OcrService } from './ocr.service';

import { createWorker } from 'tesseract.js';
import { RecognizeDto } from './dtos/RecognizeDto';
import { ApiKeyGuard } from '../api-key/api-key.guard';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('recognize')
  async recognize(@Body('imageBase64') imageBase64: string) {
    const buffer = Buffer.from(imageBase64, 'base64');
    const result = await this.ocrService.recognizeImage(buffer);
    return result;
  }

  @Get()
  getHello(): string {
    return this.ocrService.getHello();
  }

  @Get('base64')
  getBase64(): string {
    return this.ocrService.getBase64({ path: './images/test.jpg' });
  }

  @Get('view')
  @UseGuards(ApiKeyGuard) // 使用 API Key 守卫保护这个路由
  async getView(): Promise<RecognizeDto> {
    // const buffer = Buffer.from(imageData, 'base64');
    // const result = await this.ocrService.recognizeImage(buffer);

    // const path = require('path');
    // const { createWorker } = require('../../');

    // const [,, imagePath] = process.argv;
    const image = './images/test.png';

    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        console.log(`worker ${m.workerId} - ${m.jobId} progress`, m.progress);
      },
    });
    const { data } = await worker.recognize(image);

    const words = data.words.map((word) => ({
      text: word.text,
      left: word.bbox.x0,
      top: word.bbox.y0,
      width: word.bbox.x1 - word.bbox.x0,
      height: word.bbox.y1 - word.bbox.y0,
    }));

    // console.log(data.text);
    await worker.terminate();

    return {
      text: data.text,
      words,
    };
  }
}
