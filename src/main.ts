import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://mind-lab-fe-55b3987890a9.herokuapp.com',
    credentials: true,
  });
  await app.listen(PORT);
}
bootstrap();
