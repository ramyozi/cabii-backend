import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './infrastructure/decorator/auth/jwt-auth.guard';

async function runMigrations(app: INestApplication) {
  const dataSource = app.get(DataSource);
  await dataSource.runMigrations();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });

  const allowedOrigins =
    process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? [
      'http://localhost:8081',
      'http://192.168.1.32:8081',
      'http://localhost:3000',
      'http://localhost:19006',
      'exp://127.0.0.1:19000',
    ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow mobile/curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`❌ CORS blocked: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('Template API')
    .setDescription('API documentation for Template backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Paste your JWT token here (or use cookies)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      withCredentials: true, 
    },
  });

  await runMigrations(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger running on http://localhost:${port}/api`);
}

void bootstrap();
