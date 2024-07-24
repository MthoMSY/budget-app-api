import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  const apiPort = configService.get('API_PORT');
  await app.listen(apiPort || 3000);
  console.log(`App is running on port: ${apiPort}`);
}
bootstrap();
