import { FileDto } from 'src/dtos/FileDto';
import { WordDto } from './WordDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RecognizeDto {
  @ApiProperty()
  version?: string;

  @ApiProperty()
  langs: string[];

  @ApiProperty()
  text: string;

  @ApiProperty({
    type: () => [WordDto],
  })
  words?: Array<WordDto>;

  @ApiProperty({
    type: () => FileDto,
  })
  @IsNotEmpty()
  file: FileDto;
}
