import { ApiProperty } from '@nestjs/swagger';
import { BoxDto } from './BoxDto';

export class WordDto {
  @ApiProperty({ description: 'The word text' })
  text: string;
  //   left: number;
  //   top: number;
  //   width: number;
  //   height: number;

  @ApiProperty({
    description: 'bbox',
    type: () => BoxDto,
  })
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}
