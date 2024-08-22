import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfigure } from './configures/swaggerConfigure';
import { corsConfigure } from './configures/corsConfigure';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigure(app, { path: '/' });
  corsConfigure(app);
  await app.listen(process.env.PORT || 3000, process.env.HOST);
}
bootstrap();
