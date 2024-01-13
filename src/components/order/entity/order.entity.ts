import { Type } from 'class-transformer';
import { LocalDateTransformer } from 'src/common/util/dateTransformer';
import { Customer } from 'src/components/customer/entity/customer.entity';
import { OrderType } from 'src/types/order';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ database: 'second', name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column('int', { name: 'customer_id', nullable: true })
  customerId: number;

  @Column({ name: 'amount', nullable: false })
  amount: number;

  @Column({
    type: 'timestamptz',
    name: 'ordered_at',
    nullable: false,
    transformer: new LocalDateTransformer(),
  })
  orderedAt: Date;

  @Column('enum', { name: 'order_type', enum: OrderType })
  orderType: OrderType;

  @ManyToOne(() => Customer, (customer) => customer.Orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'id' }])
  Customer: Customer;

  constructor(
    customerId: number,
    orderedAt: Date,
    orderType: OrderType,
    amount: number,
  ) {
    this.customerId = customerId;
    this.orderedAt = orderedAt;
    this.orderType = orderType;
    this.amount = amount;
  }
}

export class GetOrderList {
  orderId: number;
  orderAmount: number;
  customerName: string;
  customerGrade: string;
  orderType: OrderType;
  orderedAt: Date;
}

export class OrderMonthlySalesStat {
  @Type(() => Number)
  year: number;
  @Type(() => Number)
  month: number;
  @Type(() => Number)
  totalRefundAmount: number;
  @Type(() => Number)
  totalOrderAmount: number;
}
