import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomerBasic, CustomerDetailed } from './customer.interface';
import { DataService } from './data.service';

@Controller()
export class AppController {
  constructor(private readonly dataService: DataService) {}

  // Ziskat uvitaci zpravu
  @Get()
  getHello(): string {
    return this.dataService.getHello();
  }

  // Ziskat seznam vsech zakazniku
  @Get('customers')
  async listAllCustomers(): Promise<CustomerBasic[]> {
    return this.dataService.listAllCustomers();
  }

  // Ziskat podrobnosti o zakaznikovi podle ID
  @Get('customers/:id')
  async getCustomerDetails(@Param('id') id: string): Promise<CustomerDetailed> {
    return this.dataService.getCustomerDetails(id);
  }

  // Vytvorit noveho zakaznika (vyzaduje vsechny informace)
  @Post('customers')
  async createCustomer(
    @Body() customer: CustomerDetailed,
  ): Promise<{ message: string }> {
    try {
      const result = await this.dataService.createCustomer(customer);
      return { message: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Aktualizovat zakaznika podle ID a novych informaci
  @Put('customers/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerData: Partial<CustomerDetailed>,
  ): Promise<{ message: string }> {
    try {
      const result = await this.dataService.updateCustomer(id, customerData);
      return { message: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Smazat zakaznika podle ID
  @Delete('customers/:id')
  async deleteCustomer(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const result = await this.dataService.deleteCustomer(id);
      return { message: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

