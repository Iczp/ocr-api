import { ApiProperty } from '@nestjs/swagger';

export class BoxDto {
  @ApiProperty()
  x0: number;

  @ApiProperty()
  y0: number;

  @ApiProperty()
  x1: number;

  @ApiProperty()
  y1: number;
}
