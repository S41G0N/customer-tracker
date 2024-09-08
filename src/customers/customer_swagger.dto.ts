import { ApiProperty } from '@nestjs/swagger';

export class CustomerDetailedDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;
}

export class CustomerBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
