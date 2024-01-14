import { Inject, Injectable } from '@nestjs/common';
import { OrderListQueryDto } from './dto/request/order.list.query.dto';
import { OrderListResponseDto } from './dto/response/order.list.response.dto';
import { OrderMonthlySalesStat } from './entity/order.entity';
import { DEPENDENCY } from 'src/common/const/dependencyKey';
import { IOrderRepository } from './interface/order.repository.interface';
import { IOrderService } from './interface/order.service.interface';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(DEPENDENCY.ORDER.ORDER_REPOSITORY_KEY)
    private readonly orderRepository: IOrderRepository,
  ) {}

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
