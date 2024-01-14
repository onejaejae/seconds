import * as moment from 'moment-timezone';
import { Exclude, Expose } from 'class-transformer';
import { GetOrderList } from '../../entity/order.entity';
import { OrderType } from 'src/types/order';

export class OrderListResponseDto {
  @Exclude() private _orderId: number;
  @Exclude() private _orderAmount: number;
  @Exclude() private _customerName: string;
  @Exclude() private _customerGrade: string;
  @Exclude() private _orderType: OrderType;
  @Exclude() private _orderedAt: Date;

  static of(getOrderList: Array<GetOrderList>) {
    return getOrderList.map((getOrder) => {
      const orderListResponseDto = new OrderListResponseDto();
      orderListResponseDto._orderId = getOrder.orderId;
      orderListResponseDto._orderAmount = getOrder.orderAmount;
      orderListResponseDto._customerName = getOrder.customerName;
      orderListResponseDto._customerGrade = getOrder.customerGrade;
      orderListResponseDto._orderType = getOrder.orderType;
      orderListResponseDto._orderedAt = getOrder.orderedAt;
      return orderListResponseDto;
    });
  }

  @Expose()
  get orderId(): number {
    return this._orderId;
  }
  @Expose()
  get orderAmount(): number {
    return this._orderAmount;
  }
  @Expose()
  get customerName(): string {
    return this._customerName;
  }
  @Expose()
  get customerGrade(): string {
    return this._customerGrade;
  }
  @Expose()
  get orderType(): OrderType {
    return this._orderType;
  }
  @Expose()
  get orderedAt(): string {
    return moment(this._orderedAt).format('YYYY-MM-DD');
  }
}
