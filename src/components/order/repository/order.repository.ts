import { Injectable } from '@nestjs/common';
import { SecondBaseRepository } from 'src/common/database/base.repository';
import { TransactionManager } from 'src/common/database/transaction.manager';
import { Between, EntityTarget } from 'typeorm';
import { Order } from '../entity/order.entity';

@Injectable()
export class OrderRepository extends SecondBaseRepository<Order> {
  constructor(protected readonly txManager: TransactionManager) {
    super(Order);
  }

  getName(): EntityTarget<Order> {
    return Order.name;
  }
}
