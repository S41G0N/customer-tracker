import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataModule } from './data.module';

@Module({
  imports: [DataModule],
  controllers: [AppController],
})
export class AppModule {}
