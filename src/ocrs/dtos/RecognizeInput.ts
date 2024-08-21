import { ApiProperty } from '@nestjs/swagger';
import { langsConsts } from 'src/consts/langsConsts';

export class RecognizeInput {
  @ApiProperty({
    type: 'string',
    isArray: true,
    description: 'List of languages to recognize',
    default: 'osd',
    example: 'eng+chi_sim',
    // enum: ['eng', 'chi_sim', 'chi_tra'],
    enum: Object.keys(langsConsts),
  })
  langs: string | string[];
}
