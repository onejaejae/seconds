import { Controller, Get, Query } from '@nestjs/common';
import { OrderListQueryDto } from './dto/request/order.list.dto';
import { OrderService } from './order.service';
import { OrderListResponseDto } from './dto/response/order.list.response.dto';
import { OrderMonthlySalesStat } from './entity/order.entity';

@Controller('/orders')
export class orderController {
  constructor(private readonly orderService: OrderService) {}

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
