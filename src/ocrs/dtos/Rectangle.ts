import { ApiProperty } from '@nestjs/swagger';
import Tesseract from 'tesseract.js';

export class Rectangle implements Tesseract.Rectangle {
  @ApiProperty()
  left: number;

  @ApiProperty()
  top: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;
}
