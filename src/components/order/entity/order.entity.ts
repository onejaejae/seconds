import { Customer } from 'src/components/customer/entity/customer.entity';
import { OrderType } from 'src/types/order';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ database: 'second', name: 'orders' })
export class Order {
  @PrimaryColumn('int', { name: 'customer_id' })
  customerId: number;

  @Column({ name: 'ordered_at', type: Date })
  orderedAt: Date;

  @Column('enum', { name: 'order_type', enum: OrderType })
  orderType: OrderType;

  @ManyToOne(() => Customer, (customer) => customer.Orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  Customer: Customer;

  constructor(customerId: number, orderedAt: Date, orderType: OrderType) {
    this.customerId = customerId;
    this.orderedAt = orderedAt;
    this.orderType = orderType;
  }
}
