import { FileDto } from 'src/dtos/FileDto';
import { WordDto } from './WordDto';
import { ApiProperty } from '@nestjs/swagger';

export class RecognizeDto {
  @ApiProperty({})
  text: string;

  @ApiProperty({
    type: () => [WordDto],
  })
  words?: Array<WordDto>;

  @ApiProperty({
    type: () => FileDto,
  })
  file: FileDto;
}
