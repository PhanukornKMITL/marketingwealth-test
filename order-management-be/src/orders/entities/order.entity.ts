import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  productName: string;

  @Column()
  quantity: number;

  @Column('decimal') 
  price: number;

  @Column('decimal')
  total: number;
}
