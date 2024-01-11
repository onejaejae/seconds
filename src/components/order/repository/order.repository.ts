import { Injectable } from '@nestjs/common';
import { SecondBaseRepository } from 'src/common/database/base.repository';
import { TransactionManager } from 'src/common/database/transaction.manager';
import { Between, EntityTarget } from 'typeorm';
import { Order } from '../entity/order.entity';
import { OrderType } from 'src/types/order';

@Injectable()
export class OrderRepository extends SecondBaseRepository<Order> {
  constructor(protected readonly txManager: TransactionManager) {
    super(Order);
  }

  getName(): EntityTarget<Order> {
    return Order.name;
  }

  async getMonthlySalesStatistics(): Promise<any[]> {
    const subQueryAlias = 'tmp';

    // Creating a subquery
    const subQuery = this.getSubQueryBuilder(subQueryAlias)
      .select([
        'id',
        'EXTRACT(YEAR FROM ordered_at) AS year',
        'EXTRACT(MONTH FROM ordered_at) AS month',
        'CASE WHEN order_type = :refundType THEN amount ELSE 0 END AS refund_amount',
        'CASE WHEN order_type = :refundType THEN 0 ELSE amount END AS order_amount',
      ])
      .getQuery();

    // Main query
    const result = await this.getQueryBuilder()
      .select([
        `${subQueryAlias}.year AS year`,
        `${subQueryAlias}.month AS month`,
        `SUM(${subQueryAlias}.refund_amount) AS totalRefundAmount`,
        `SUM(${subQueryAlias}.order_amount) AS totalOrderAmount`,
      ])
      .innerJoin(`(${subQuery})`, subQueryAlias, 'order.id = tmp.id')
      .groupBy('year, month')
      .setParameters({ refundType: OrderType.REFUND })
      .orderBy('year, month')
      .getRawMany();

    return result;
  }
}
