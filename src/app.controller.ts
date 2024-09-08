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

  @Get()
  getHello(): string {
    return this.dataService.getHello();
  }

  @Get('customers')
  listAllCustomers(): CustomerBasic[] {
    return this.dataService.listAllCustomers();
  }

  @Get('customers/:id')
  getCustomerDetails(@Param('id') id: string): CustomerDetailed {
    return this.dataService.getCustomerDetails(id);
  }

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
