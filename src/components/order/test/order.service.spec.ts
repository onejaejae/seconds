import { type MockProxy, mock } from 'jest-mock-extended';
import { IOrderService } from '../interface/order.service.interface';
import { IOrderRepository } from '../interface/order.repository.interface';
import { OrderService } from '../order.service';
import { GetOrderList, OrderMonthlySalesStat } from '../entity/order.entity';
import { OrderListQueryDto } from '../dto/request/order.list.query.dto';
import { OrderListResponseDto } from '../dto/response/order.list.response.dto';

describe('order service', () => {
  let orderRepository: MockProxy<IOrderRepository>;
  let service: IOrderService;

  beforeAll(async () => {
    orderRepository = mock<IOrderRepository>();
    service = new OrderService(orderRepository);
  });

  describe('getOrderList', () => {
    it('should return an array of OrderListResponseDto', async () => {
      // given
      const orderListQueryDto: OrderListQueryDto = {
        startDate: new Date(),
        endDate: new Date(),
        orderType: 2,
        pageSize: 50,
        pageNo: 1,
      };
      const mockOrderList: GetOrderList[] = [
        {
          orderId: 1,
          orderAmount: 100,
          customerName: 'test',
          customerGrade: 'A',
          orderType: 'order',
          orderedAt: new Date(),
        },
      ];
      orderRepository.getOrderList.mockResolvedValue(mockOrderList);

      // when
      const result = await service.getOrderList(orderListQueryDto);

      // then
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(OrderListResponseDto);
    });
  });

  describe('getMonthlySalesStatistics', () => {
    it('should return an array of OrderMonthlySalesStat', async () => {
      // given
      const mockMonthlySalesStat: OrderMonthlySalesStat[] = [
        {
          year: 2023,
          month: 1,
          totalRefundAmount: 100,
          totalOrderAmount: 200,
        },
      ];
      orderRepository.getMonthlySalesStatistics.mockResolvedValue(
        mockMonthlySalesStat,
      );

      // when
      const result = await service.getMonthlySalesStatistics();

      // then
      expect(orderRepository.getMonthlySalesStatistics).toHaveBeenCalled();
      expect(result).toEqual(mockMonthlySalesStat);
    });
  });
});
