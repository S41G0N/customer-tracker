import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customers/customer.entity';
import { faker } from '@faker-js/faker';
import {
  CustomerBasic,
  CustomerDetailed,
} from '../customers/customer.interface';

@Injectable()
export class DataService implements OnModuleInit {
  constructor(
    @InjectRepository(Customer)
    private customerDatabase: Repository<Customer>,
  ) {}

  // Generace nahodnych zakazniku behem startu, pokud je sqlite databaze prazdna
  async onModuleInit() {
    const count = await this.customerDatabase.count();
    if (count === 0) {
      await this.generateRandomCustomers();
    }
  }

  // Tvorba 50 nahodne generovanych zakazniku (ID je generovano dle cisla v poradi loopu, ale muze byt i jine)
  async generateRandomCustomers() {
    for (let i = 0; i < 50; i++) {
      const customer: CustomerDetailed = {
        id: `${i}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
      };
      await this.customerDatabase.save(customer);
    }
  }

  // Jednoduchy test routu
  getHello(): string {
    return 'Hello World!';
  }

  // Loopne cely hashmap zakazniku a extrahuje id a jmeno kazdeho zaznamu
  async listAllCustomers(): Promise<CustomerBasic[]> {
    const customers = await this.customerDatabase.find();
    return customers.map(({ id, name }) => ({ id, name }));
  }

  // Extrahuje detailni informace zakaznika podle ID
  async getCustomerDetails(id: string): Promise<CustomerDetailed> {
    const customer = await this.customerDatabase.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  // Prida zakaznika do docasne databaze pokud se jedna o unikatni ID
  async createCustomer(customer: CustomerDetailed): Promise<string> {
    try {
      // Hazi error pokud zakaznik jiz existuje (nelze mit 2 zakazniky se stejnym ID)
      const existingCustomer = await this.customerDatabase.findOne({
        where: { id: customer.id },
      });
      if (existingCustomer) {
        throw new Error(`Customer with ID ${customer.id} already exists`);
      }
      // Muze se pridat vice checku a kontrol, nicmene pro jednoduchou logiku nechavam pouze check na duplcitni ID
      await this.customerDatabase.save(customer);
      return `Customer: ${customer.id} created successfully`;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  // Aktualizuje zakaznika (podle ID) na zaklade novych informaci
  async updateCustomer(
    id: string,
    customerData: Partial<CustomerDetailed>,
  ): Promise<string> {
    try {
      // Kontrola zda ID existuje
      const customer = await this.getCustomerDetails(id);
      await this.customerDatabase.update(id, {
        ...customer,
        ...customerData,
      });
      return `Customer: ${id} updated successfully`;
    } catch (error) {
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }

  // Smazani zakaznika z databaze podle ID
  async deleteCustomer(id: string): Promise<string> {
    try {
      // Kontrola ID (nelze smazat neexistujiciho zakaznika)
      const result = await this.customerDatabase.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return `Customer: ${id} deleted successfully`;
    } catch (error) {
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
  }
}
