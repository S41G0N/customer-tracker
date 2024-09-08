import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // LAUNCH APP ON 'PORT' DEFINED IN '.env' or default port 3000
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
