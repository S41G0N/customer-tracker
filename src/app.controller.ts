import { DataService } from './data/data.service';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
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
import {
  CustomerBasic,
  CustomerDetailed,
} from './customers/customer.interface';
import {
  CustomerBasicDto,
  CustomerDetailedDto,
} from './customers/customer_swagger.dto';

@Controller()
export class AppController {
  constructor(private readonly dataService: DataService) {}

  // Ziskat uvitaci zpravu
  @Get()
  @ApiOperation({ summary: 'Print Hello' })
  @ApiResponse({
    status: 200,
    description: 'Prints hello',
  })
  getHello(): string {
    return this.dataService.getHello();
  }

  // Ziskat seznam vsech zakazniku
  @Get('customers')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all customers',
    type: [CustomerBasicDto],
  })
  async listAllCustomers(): Promise<CustomerBasic[]> {
    return this.dataService.listAllCustomers();
  }

  // Ziskat podrobnosti o zakaznikovi podle ID
  @Get('customers/:id')
  @ApiOperation({ summary: 'Get customer details' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns customer details',
    type: CustomerDetailedDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getCustomerDetails(@Param('id') id: string): Promise<CustomerDetailed> {
    return this.dataService.getCustomerDetails(id);
  }

  // Vytvorit noveho zakaznika (vyzaduje vsechny informace)
  @Post('customers')
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CustomerDetailedDto })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: CustomerDetailedDto, description: 'Partial customer data' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
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
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been successfully deleted',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async deleteCustomer(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const result = await this.dataService.deleteCustomer(id);
      return { message: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
