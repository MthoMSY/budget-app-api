import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);

  app.enableCors();
  const apiPort = configService.get('API_PORT');
  await app.listen(apiPort || 3000);
  console.log(`App is running on port: ${apiPort}`);
}
bootstrap();
