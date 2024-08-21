import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';
import { langsConsts } from '../consts/langsConsts';

@Injectable()
export class OcrService {
  public readonly languages = langsConsts;
  async recognizeImage(langs: string | string[], buffer: Buffer) {
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
      langs,
      text: data.text,
      words,
    };
  }

  async getLangs() {
    return this.languages;
  }
}
