import { Module } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';

@Module({
  providers: [OrderRepository],
  exports: [OrderRepository],
})
export class OrderModule {}
