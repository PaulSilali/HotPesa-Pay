import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://127.0.0.1:4173', 'http://127.0.0.1:4174', 'http://localhost:4173', 'http://localhost:4174'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Idempotency-Key'],
  });
  await app.listen(Number(process.env.PORT ?? 3000), '127.0.0.1');
}

void bootstrap();
