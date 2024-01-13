import { Injectable } from '@nestjs/common';
import { SecondBaseRepository } from 'src/common/database/base.repository';
import { TransactionManager } from 'src/common/database/transaction.manager';
import { Between, EntityTarget } from 'typeorm';
import {
  GetOrderList,
  Order,
  OrderMonthlySalesStat,
} from '../entity/order.entity';
import { OrderType } from 'src/types/order';
import { TransformPlainToInstance } from 'class-transformer';

@Injectable()
export class OrderRepository extends SecondBaseRepository<Order> {
  constructor(protected readonly txManager: TransactionManager) {
    super(Order);
  }

  getName(): EntityTarget<Order> {
    return Order.name;
  }

  @TransformPlainToInstance(OrderMonthlySalesStat)
  async getMonthlySalesStatistics(): Promise<OrderMonthlySalesStat[]> {
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

  @TransformPlainToInstance(GetOrderList)
  async getOrderList(
    startDate: Date,
    endDate: Date,
    orderType: number,
    customerId: number,
    pageSize: number,
    pageNo: number,
  ): Promise<GetOrderList[]> {
    const queryBuilder = this.getQueryBuilder()
      .select('order.ordered_at', 'orderedAt')
      .addSelect('order.order_type', 'orderType')
      .addSelect('order.amount', 'orderAmount')
      .addSelect('order.id', 'orderId')
      .addSelect('customer.name', 'customerName')
      .addSelect('customer.grade', 'customerGrade')
      .leftJoin('order.Customer', 'customer')
      .andWhere('order.orderedAt >= :startDate', { startDate })
      .andWhere('order.orderedAt <= :endDate', { endDate })
      .orderBy('order.orderedAt', 'DESC');

    switch (orderType) {
      case 0:
        queryBuilder.andWhere('order.orderType = :orderType', {
          orderType: OrderType.ORDER,
        });
        break;
      case 1:
        queryBuilder.andWhere('order.orderType = :orderType', {
          orderType: OrderType.REFUND,
        });
        break;
    }

    if (customerId) {
      queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    }

    return queryBuilder
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .getRawMany();
  }
}
