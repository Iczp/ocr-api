import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './configures/configureSwagger';
import { configureCors } from './configures/configureCors';

declare module '@nestjs/common' {
  interface INestApplication {
    configureCors(): void;
    configureSwagger(): void;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  configureCors(app);
  await app.listen(3000);
}
bootstrap();
