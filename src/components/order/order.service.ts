import { Injectable } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { OrderListQueryDto } from './dto/request/order.list.dto';
import { OrderListResponseDto } from './dto/response/order.list.response.dto';
import { OrderMonthlySalesStat } from './entity/order.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getOrderList(
    orderListQueryDto: OrderListQueryDto,
  ): Promise<Array<OrderListResponseDto>> {
    const { startDate, endDate, orderType, customerId, pageSize, pageNo } =
      orderListQueryDto;

    const orderList = await this.orderRepository.getOrderList(
      startDate,
      endDate,
      orderType,
      customerId,
      pageSize,
      pageNo,
    );

    return OrderListResponseDto.of(orderList);
  }

  async getMonthlySalesStatistics(): Promise<Array<OrderMonthlySalesStat>> {
    return this.orderRepository.getMonthlySalesStatistics();
  }
}
