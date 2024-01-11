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
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'customer_id' })
  customerId: number;

  @Column({ name: 'amount', type: Number })
  amount: number;

  @Column({
    type: 'timestamptz',
    name: 'ordered_at',
  })
  orderedAt: Date;

  @Column('enum', { name: 'order_type', enum: OrderType })
  orderType: OrderType;

  @ManyToOne(() => Customer, (customer) => customer.Orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
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
