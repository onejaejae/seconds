import { ClassProvider, Module } from '@nestjs/common';
import { CustomerRepository } from './repository/customer.repository';
import { DEPENDENCY } from 'src/common/const/dependencyKey';

export const customerRepository: ClassProvider = {
  provide: DEPENDENCY.CUSTOMER.CUSTOMER_REPOSITORY_KEY,
  useClass: CustomerRepository,
};

@Module({
  providers: [customerRepository],
  exports: [customerRepository],
})
export class CustomerModule {}
