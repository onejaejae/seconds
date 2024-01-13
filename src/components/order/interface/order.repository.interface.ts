import { IBaseRepository } from 'src/common/database/interface/base.repository.interface';
import {
  GetOrderList,
  Order,
  OrderMonthlySalesStat,
} from '../entity/order.entity';

export interface IOrderRepository extends IBaseRepository<Order> {
  getMonthlySalesStatistics(): Promise<OrderMonthlySalesStat[]>;
  getOrderList(
    startDate: Date,
    endDate: Date,
    orderType: number,
    customerId: number,
    pageSize: number,
    pageNo: number,
  ): Promise<GetOrderList[]>;
}
