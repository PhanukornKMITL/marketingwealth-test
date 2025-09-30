import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

export interface Order {
  id: number;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private idCounter = 1;

  create(createOrderDto: CreateOrderDto): Order {
    const newOrder: Order = { id: this.idCounter++, ...createOrderDto };
    this.orders.push(newOrder);
    return newOrder;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto): Order {
    const order = this.findOne(id);
    Object.assign(order, updateOrderDto);
    return order;
  }

  remove(id: number): void {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) throw new NotFoundException(`Order #${id} not found`);
    this.orders.splice(index, 1);
  }
}
