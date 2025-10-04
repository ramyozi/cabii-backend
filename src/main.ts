import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';

async function runMigrations(app: INestApplication) {
  const appDataSource = app.get(DataSource);

  await appDataSource.runMigrations();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'], // enable verbose logs
  });

  const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map((o) =>
    o.trim(),
  ) ?? [
    'http://localhost:8081',
    'http://192.168.1.32:8081',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn(`❌ CORS blocked request from origin: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Template')
    .setDescription('Template API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);
  await runMigrations(app);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
