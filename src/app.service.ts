import { Injectable } from '@nestjs/common';
import { FileType } from './types/common';
import { ExcelService } from './components/excel/excel.service';
import { CustomerRepository } from './components/customer/repository/customer.repository';
import { OrderRepository } from './components/order/repository/order.repository';
import { Customer } from './components/customer/entity/customer.entity';
import { Order } from './components/order/entity/order.entity';
import { Transactional } from './common/decorator/transaction.decorator';
import { OrderListDto } from './components/order/dto/request/order.list.dto';
import { OrderListResponseDto } from './components/order/dto/response/order.list.response.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly excelService: ExcelService,
    private readonly customerRepository: CustomerRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  @Transactional()
  async getHello(file: FileType): Promise<any> {
    const allEntities = this.excelService.excelToEntity(file);

    for (const targetEntities of allEntities) {
      const targetEntity = targetEntities[0];
      if (targetEntity instanceof Customer) {
        const customerEntities = targetEntities as Customer[];
        await this.customerRepository.bulkInsert(customerEntities);
      } else if (targetEntity instanceof Order) {
        const orderEntities = targetEntities as Order[];
        await this.orderRepository.bulkInsert(orderEntities);
      }
    }
  }

  async getHello2(): Promise<any> {
    const res = await this.orderRepository.getMonthlySalesStatistics();
    console.log('res', res);
  }

  async getHello3(
    orderListDto: OrderListDto,
  ): Promise<Array<OrderListResponseDto>> {
    const { startDate, endDate, orderType, customerId, pageSize, pageNo } =
      orderListDto;

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
}
