import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Konfigurace Swaggeru pro interaktivni dokumentaci k API
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customers API')
    .setDescription('API for managing customer data')
    .setVersion('1.0')
    .addTag('customers')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Spusti aplikaci na portu v '.env' PORT nebo 3000
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

