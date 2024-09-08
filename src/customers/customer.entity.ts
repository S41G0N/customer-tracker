// customer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid') id: string; // Primarni klic tabulky (ID)

  @Column() name: string; //Jmeno uzivatele/zakaznika

  @Column() email: string; //Email

  @Column() address: string; //Adresa
}
