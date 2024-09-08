import { Injectable } from '@nestjs/common';

@Injectable()
export class DataService {
  private data = new Map<string, any>();

  // Test method
  getHello(): string {
    return 'Hello World!';
  }

  // CRUD operations
  create(key: string, value: any): void {
    this.data.set(key, value);
  }

  read(key: string): any {
    return this.data.get(key);
  }

  update(key: string, value: any): void {
    this.data.set(key, value);
  }

  delete(key: string): void {
    this.data.delete(key);
  }
}
