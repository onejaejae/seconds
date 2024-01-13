import { ClassProvider, Module } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { DEPENDENCY } from 'src/common/const/dependencyKey';

const orderService: ClassProvider = {
  provide: DEPENDENCY.ORDER.ORDER_SERVICE_KEY,
  useClass: OrderService,
};

export const orderRepository: ClassProvider = {
  provide: DEPENDENCY.ORDER.ORDER_REPOSITORY_KEY,
  useClass: OrderRepository,
};

@Module({
  controllers: [OrderController],
  providers: [orderService, orderRepository],
  exports: [orderRepository],
})
export class OrderModule {}
