import { Order } from 'src/components/order/entity/order.entity';
import { GradeType } from 'src/types/customer';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ database: 'second', name: 'customers' })
export class Customer {
  @PrimaryColumn({ unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 30, nullable: false })
  name: string;

  @Column('enum', { name: 'grade', enum: GradeType, nullable: false })
  grade: GradeType;

  @OneToMany(() => Order, (order) => order.Customer)
  Orders: Order[];

  constructor(id: number, name: string, grade: GradeType) {
    this.id = id;
    this.name = name;
    this.grade = grade;
  }
}
