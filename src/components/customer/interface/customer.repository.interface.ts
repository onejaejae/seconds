import { IBaseRepository } from 'src/common/database/interface/base.repository.interface';
import { Customer } from '../entity/customer.entity';

export interface ICustomerRepository extends IBaseRepository<Customer> {}
