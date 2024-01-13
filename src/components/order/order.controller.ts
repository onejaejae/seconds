import { Controller, Get, Inject, Query } from '@nestjs/common';
import { OrderListQueryDto } from './dto/request/order.list.dto';
import { OrderListResponseDto } from './dto/response/order.list.response.dto';
import { OrderMonthlySalesStat } from './entity/order.entity';
import { DEPENDENCY } from 'src/common/const/dependencyKey';
import { IOrderService } from './interface/order.service.interface';

@Controller('/orders')
export class OrderController {
  constructor(
    @Inject(DEPENDENCY.ORDER.ORDER_SERVICE_KEY)
    private readonly orderService: IOrderService,
  ) {}

  @Get()
  async getOrderList(
    @Query() orderListQueryDto: OrderListQueryDto,
  ): Promise<Array<OrderListResponseDto>> {
    return this.orderService.getOrderList(orderListQueryDto);
  }

  @Get('/stat')
  async getMonthlySalesStatistics(): Promise<Array<OrderMonthlySalesStat>> {
    return this.orderService.getMonthlySalesStatistics();
  }
}
