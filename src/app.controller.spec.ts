import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DataService } from './data.service';
import { CustomerBasic, CustomerDetailed } from './customer.interface';

describe('AppController', () => {
  let appController: AppController;
  let dataService: DataService;

  beforeEach(async () => {
    // Vytvorime testovaci modul NestJS
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: DataService,
          // Vytvorime mock DataService s Jest mock funkcemi
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
            listAllCustomers: jest.fn(),
            getCustomerDetails: jest.fn(),
            createCustomer: jest.fn(),
            updateCustomer: jest.fn(),
            deleteCustomer: jest.fn(),
          },
        },
      ],
    }).compile();

    // Ziskame instance AppController a DataService z testovaciho modulu
    appController = module.get<AppController>(AppController);
    dataService = module.get<DataService>(DataService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // Otestujeme metodu getHello controlleru
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('listAllCustomers', () => {
    it('should return an array of customers', async () => {
      // Pripravime mock data
      const result: CustomerBasic[] = [{ id: '1', name: 'John' }];
      // Namockujeme metodu listAllCustomers DataService, aby vracela nase pripravena data
      jest.spyOn(dataService, 'listAllCustomers').mockResolvedValue(result);
      // Ocekavame, ze metoda controlleru vrati stejna data jako sluzba
      expect(await appController.listAllCustomers()).toBe(result);
    });
  });

  describe('getCustomerDetails', () => {
    it('should return customer details', async () => {
      // Pripravime mock detaily zakaznika
      const result: CustomerDetailed = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        address: '123 Main St',
      };
      // Namockujeme metodu getCustomerDetails, aby vracela nase pripravena data
      jest.spyOn(dataService, 'getCustomerDetails').mockResolvedValue(result);
      // Ocekavame, ze metoda controlleru vrati stejna data jako sluzba
      expect(await appController.getCustomerDetails('1')).toBe(result);
    });
  });
  describe('createCustomer', () => {
    it('should create a customer', async () => {
      // Pripravime data zakaznika
      const customerData: CustomerDetailed = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        address: '123 Main St',
      };
      const expectedResult = { message: 'Customer: 1 created successfully' };

      // Namockujeme metodu createCustomer, aby vracela ocekavany vysledek
      jest
        .spyOn(dataService, 'createCustomer')
        .mockResolvedValue('Customer: 1 created successfully');

      // Zavolame metodu createCustomer controlleru a pockame na vysledek
      const result = await appController.createCustomer(customerData);

      // Ocekavame, ze metoda createCustomer sluzby byla zavolana se spravnymi daty
      expect(dataService.createCustomer).toHaveBeenCalledWith(customerData);
      // Ocekavame, ze metoda vrati ocekavany vysledek
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer', async () => {
      const id = '1';
      // Pripravime castecna data zakaznika pro aktualizaci
      const customerData: Partial<CustomerDetailed> = { name: 'John Updated' };
      const expectedResult = { message: 'Customer: 1 updated successfully' };

      // Namockujeme metodu updateCustomer, aby vracela ocekavany vysledek
      jest
        .spyOn(dataService, 'updateCustomer')
        .mockResolvedValue('Customer: 1 updated successfully');

      // Zavolame metodu updateCustomer controlleru a pockame na vysledek
      const result = await appController.updateCustomer(id, customerData);

      // Ocekavame, ze metoda updateCustomer sluzby byla zavolana se spravnym id a daty
      expect(dataService.updateCustomer).toHaveBeenCalledWith(id, customerData);
      // Ocekavame, ze metoda vrati ocekavany vysledek
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteCustomer', () => {
    it('should remove an existing customer', async () => {
      const id = '1';
      const expectedResult = { message: 'Customer: 1 deleted successfully' };

      // Namockujeme metodu deleteCustomer, aby vracela ocekavany vysledek
      jest
        .spyOn(dataService, 'deleteCustomer')
        .mockResolvedValue('Customer: 1 deleted successfully');

      // Zavolame metodu deleteCustomer controlleru a pockame na vysledek
      const result = await appController.deleteCustomer(id);

      // Ocekavame, ze metoda deleteCustomer sluzby byla zavolana se spravnym id
      expect(dataService.deleteCustomer).toHaveBeenCalledWith(id);
      // Ocekavame, ze metoda vrati ocekavany vysledek
      expect(result).toEqual(expectedResult);
    });
  });
});
