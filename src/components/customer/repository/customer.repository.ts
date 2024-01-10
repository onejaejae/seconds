import { Injectable } from '@nestjs/common';
import { SecondBaseRepository } from 'src/common/database/base.repository';
import { Customer } from '../entity/customer.entity';
import { TransactionManager } from 'src/common/database/transaction.manager';
import { EntityTarget } from 'typeorm';

@Injectable()
export class CustomerRepository extends SecondBaseRepository<Customer> {
  constructor(protected readonly txManager: TransactionManager) {
    super(Customer);
  }

  getName(): EntityTarget<Customer> {
    return Customer.name;
  }
}
