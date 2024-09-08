// src/data/data.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { DataService } from './data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])], //Import ORM
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
