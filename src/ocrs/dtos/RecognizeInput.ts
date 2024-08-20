// import { UploadedFile } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class RecognizeInput {
  @ApiProperty({
    type: 'string',
    isArray: true,
    description: 'List of languages to recognize',
    default: 'chi_sim',
    example: 'chi_sim',
    enum: ['eng', 'chi_sim', 'chi_tra'],
  })
  langs: string;
}
