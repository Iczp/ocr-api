import { WordDto } from './WordDto';

export interface RecognizeDto {
  text: string;
  words: Array<WordDto>;
}
