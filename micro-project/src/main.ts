import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const globalPrefix = configService.get('BACKEND_PREFIX');
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform the payload to DTO instances
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    }),
  );

  await app.listen(5000);
}
bootstrap();
