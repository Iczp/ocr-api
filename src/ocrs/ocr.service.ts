import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

import * as fs from 'fs';

@Injectable()
export class OcrService {
  public readonly languages = {
    eng: '英文',
    chi_sim: '简体中文',
    chi_tra: '繁体中文',
    jpn: '日语',
    kor: '韩语',
    fra: '法语',
    deu: '德语',
    spa: '西班牙语',
    rus: '俄语',
    ara: '阿拉伯语',
    hin: '印地语',
  };
  async recognizeImage(langs: string, buffer: Buffer) {
    const worker = await createWorker(langs, 1, {
      logger: (m) => {
        console.log(`worker ${m.workerId} - ${m.jobId} progress`, m.progress);
      },
    });
    const { data } = await worker.recognize(buffer);

    const words = data.words.map((word) => ({
      text: word.text,
      bbox: word.bbox,
    }));

    return {
      text: data.text,
      words,
    };
  }

  async getLangs() {
    return this.languages;
  }

  getBase64({ path = './images/test.jpg' }: { path: string }): string {
    const file = fs.readFileSync(path);
    const fileBase64 = file.toString('base64');
    return fileBase64;
  }
}
