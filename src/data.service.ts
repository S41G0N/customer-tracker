import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerBasic, CustomerDetailed } from './customer.interface';

@Injectable()
export class DataService {
  // Store customers in a Map for quick lookup by ID
  private customers_mock_temporary_db = new Map<string, CustomerDetailed>();

  // Test method
  getHello(): string {
    return 'Hello World!';
  }

  listAllCustomers(): CustomerBasic[] {
    // Convert Map to array and extract only id and name for each customer
    const all_customers = Array.from(
      this.customers_mock_temporary_db.values(),
    ).map(({ id, name }) => ({
      id,
      name,
    }));

    return all_customers;
  }

  getCustomerDetails(id: string): CustomerDetailed {
    const customer = this.customers_mock_temporary_db.get(id);
    // Throw NotFoundException if customer not found
    if (!customer)
      throw new NotFoundException(`Customer with ID ${id} not found`);
    return customer;
  }

  async createCustomer(customer: CustomerDetailed): Promise<string> {
    try {
      // Check if customer already exists
      if (this.customers_mock_temporary_db.has(customer.id)) {
        throw new Error(`Customer with ID ${customer.id} already exists`);
      }

      // Additional business logic validation could go here if needed

      // Add new customer to the 'customers_mock_temporary_db' hashmap
      this.customers_mock_temporary_db.set(customer.id, customer);

      return `Customer: ${customer.id} created successfully`;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  async updateCustomer(
    id: string,
    customerData: Partial<CustomerDetailed>,
  ): Promise<string> {
    try {
      // Get existing customer, throws error if not found
      const customer = await this.getCustomerDetails(id);
      // Update customer data, merging new data with existing data
      this.customers_mock_temporary_db.set(id, {
        ...customer,
        ...customerData,
      });
      return `Customer: ${id} updated successfully`;
    } catch (error) {
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }

  async deleteCustomer(id: string): Promise<string> {
    try {
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
