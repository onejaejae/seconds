import { Module } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { orderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [orderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository],
})
export class OrderModule {}
