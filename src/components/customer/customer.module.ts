import { Module } from '@nestjs/common';
import { CustomerRepository } from './repository/customer.repository';

@Module({
  providers: [CustomerRepository],
  exports: [CustomerRepository],
})
export class CustomerModule {}
