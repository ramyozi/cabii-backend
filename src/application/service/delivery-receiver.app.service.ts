import { Injectable } from '@nestjs/common';

import { DeliveryReceiver } from '../../domain/entity/delivery-receiver.entity';
import { DeliveryReceiverRepository } from '../../infrastructure/repository/delivery-receiver.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { DeliveryReceiverCreateRequestDto } from '../dto/delivery-receiver/delivery-receiver-create-request.dto';

@Injectable()
export class DeliveryReceiverAppService {
  constructor(private readonly repo: DeliveryReceiverRepository) {}

  async create(
    dto: DeliveryReceiverCreateRequestDto,
  ): Promise<DeliveryReceiver> {
    const receiver = new DeliveryReceiver();

    receiver.name = dto.name;
    receiver.phone = dto.phone;
    receiver.email = dto.email;

    return await this.repo.save(receiver);
  }

  async getById(id: string): Promise<DeliveryReceiver> {
    return await this.repo.getOneById(id);
  }

  async getList(): Promise<ListInterface<DeliveryReceiver>> {
    const [receivers, count] = await this.repo.getAll();

    return new ListBuilder(receivers, count).build();
  }
}
