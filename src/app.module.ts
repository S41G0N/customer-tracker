import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataModule } from './data/data.module';
import { Customer } from './customers/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Konfigurace TypeORM pro sqlite databazi (v produkci bych doporucil neco robustnejsiho jako je MariaDB nebo Postgres)
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/customers.sqlite',
      entities: [Customer],
      synchronize: true,
    }),

    DataModule, // Import modulu pro praci s daty

    TypeOrmModule.forFeature([Customer]), // Registrace entity Customer pro TypeORM
  ],
  controllers: [AppController], // Registrace hlavniho controlleru
})
export class AppModule {}
