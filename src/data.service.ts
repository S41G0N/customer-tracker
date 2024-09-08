import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerBasic, CustomerDetailed } from './customer.interface';
import { faker } from '@faker-js/faker';

@Injectable()
export class DataService {
  // Store customers in a Map for quick lookup by ID
  private customers_mock_temporary_db = new Map<string, CustomerDetailed>();

  // Generace nahodnych zakazniku kazdy start
  onModuleInit() {
    this.generateRandomCustomers();
  }

  // Tvorba 50 nahodne generovanych zakazniku (ID je generovano dle cisla v poradi loopu, ale muze byt i jine)
  private generateRandomCustomers() {
    for (let i = 0; i < 50; i++) {
      const customer: CustomerDetailed = {
        id: `${i}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
      };
      this.customers_mock_temporary_db.set(customer.id, customer);
    }
  }

  // Jednoduchy test routu
  getHello(): string {
    return 'Hello World!';
  }

  listAllCustomers(): CustomerBasic[] {
    // Loopne cely hashmap zakazniku a extrahuje id a jmeno kazdeho zaznamu
    const all_customers = Array.from(
      this.customers_mock_temporary_db.values(),
    ).map(({ id, name }) => ({
      id,
      name,
    }));

    return all_customers;
  }

  // Extrahuje detailni informace zakaznika podle ID
  getCustomerDetails(id: string): CustomerDetailed {
    const customer = this.customers_mock_temporary_db.get(id);
    if (!customer)
      throw new NotFoundException(`Customer with ID ${id} not found`);
    return customer;
  }

  // Prida zakaznika do docasne databaze pokud se jedna o unikatni ID
  async createCustomer(customer: CustomerDetailed): Promise<string> {
    try {
      // Hazi error pokud zakaznik jiz existuje (nelze mit 2 zakazniky se stejnym ID)
      if (this.customers_mock_temporary_db.has(customer.id)) {
        throw new Error(`Customer with ID ${customer.id} already exists`);
      }

      // Muze se pridat vice checku a kontrol, nicmene pro jednoduchou logiku nechavam pouze check na duplcitni ID

      this.customers_mock_temporary_db.set(customer.id, customer);
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
      const customer = this.getCustomerDetails(id);
      this.customers_mock_temporary_db.set(id, {
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
      if (!this.customers_mock_temporary_db.has(id)) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      this.customers_mock_temporary_db.delete(id);
      return `Customer: ${id} deleted successfully`;
    } catch (error) {
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
  }
}
