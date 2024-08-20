import { Injectable } from '@nestjs/common';
import Tesseract from 'tesseract.js';

import * as fs from 'fs';

@Injectable()
export class OcrService {
  async recognizeImage(imageBuffer: Buffer): Promise<any> {
    const result = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => console.log(m),
    });
    // return result.data.text;
    // 提取每个单词的文本和位置信息
    const words = result.data.words.map((word) => ({
      text: word.text,
      left: word.bbox.x0,
      top: word.bbox.y0,
      width: word.bbox.x1 - word.bbox.x0,
      height: word.bbox.y1 - word.bbox.y0,
    }));

    return { words };
  }

  getHello(): string {
    return `Hello from OCR service`;
  }

  getBase64({ path = './images/test.jpg' }: { path: string }): string {
    const file = fs.readFileSync(path);
    const fileBase64 = file.toString('base64');
    return fileBase64;
  }
}
