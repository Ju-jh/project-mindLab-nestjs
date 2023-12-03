import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// const CLOUDPORT = process.env.PORT || 4000;
const LOCALPORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(LOCALPORT);
}
bootstrap();
