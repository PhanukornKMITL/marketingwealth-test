import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) { }

  create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      total: createOrderDto.quantity * createOrderDto.price,
    });
    return this.orderRepository.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {

    const order = await this.findOne(id);

    const updatedData = {
      ...updateOrderDto,
      total: (updateOrderDto.quantity ?? order.quantity) * (updateOrderDto.price ?? order.price),
    };

    await this.orderRepository.update(id, updatedData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Order #${id} not found`);
  }

  async findWithFilter(
    minPrice?: number,
    maxPrice?: number,
    startDate?: string,
    endDate?: string
  ): Promise<Order[]> {
    
    const query = this.orderRepository.createQueryBuilder('order');

    if (minPrice !== undefined) {
      query.andWhere('order.total >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      query.andWhere('order.total <= :maxPrice', { maxPrice });
    }
    if (startDate) {
      query.andWhere('order.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('order.createdAt <= :endDate', { endDate });
    }

    return query.getMany();
  }
}
