import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { typeOrmConfig } from './config/typeorm.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(typeOrmConfig);
  await app.listen(3000);
}
bootstrap();
