import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './configures/configureSwagger';
import { configureCors } from './configures/configureCors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app, { path: '/' });
  configureCors(app);
  await app.listen(3000);
}
bootstrap();
