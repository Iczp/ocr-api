import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configureSwagger = (app: INestApplication<any>) => {
  // Swagger 配置
  const options = new DocumentBuilder()
    .setTitle('OCR API')
    .setDescription('API for OCR service with Tesseract')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API Key',
      },
      'api-key', // 名称标识，用于关联到守卫
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
};
