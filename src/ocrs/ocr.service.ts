import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';
import { langsConsts } from '../consts/langsConsts';
import { dependencies } from '../../package.json';
@Injectable()
export class OcrService {
  public readonly languages = langsConsts;
  async recognizeImage(langs: string | string[], buffer: Buffer) {
    const worker = await createWorker(langs, 1, {
      // 设置 traineddata 文件目录
      langPath: 'traineddata/',
      cachePath: 'traineddata/',
      // corePath: 'node_modules/tesseract.js-core/index.js',
      logger: (m) => {
        console.log(`worker ${m.workerId} - ${m.jobId} progress`, m.progress);
      },
    });
    const { data } = await worker.recognize(buffer);
    const words = data.words.map((word) => ({
      text: word.text,
      bbox: word.bbox,
    }));

    const pkgName = 'tesseract.js';
    const version = `${pkgName} ${dependencies[pkgName]?.replace('^', 'v')}`;
    return {
      version,
      langs,
      text: data.text,
      words,
    };
  }

  async getLangs() {
    return this.languages;
  }
}
