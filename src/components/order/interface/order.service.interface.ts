import { OrderListQueryDto } from '../dto/request/order.list.dto';
import { OrderListResponseDto } from '../dto/response/order.list.response.dto';
import { OrderMonthlySalesStat } from '../entity/order.entity';

export interface IOrderService {
  getOrderList(
    orderListQueryDto: OrderListQueryDto,
  ): Promise<Array<OrderListResponseDto>>;
  getMonthlySalesStatistics(): Promise<Array<OrderMonthlySalesStat>>;
}
