import { INestApplication } from '@nestjs/common';

export const configureCors = (app: INestApplication<any>) => {
  // 读取环境变量
  const corsOrigin = process.env.CORS_ORIGIN;

  // 解析 CORS 原点
  const allowedOrigins = corsOrigin ? corsOrigin.split(',') : [];

  // 配置 CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
};
