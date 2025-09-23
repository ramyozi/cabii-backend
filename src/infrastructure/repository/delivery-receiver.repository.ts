import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DeliveryReceiver } from '../../domain/entity/delivery-receiver.entity';
import { DeliveryReceiverNotFoundException } from '../../domain/exception/delivery-receiver/delivery-receiver-not-found.exception';

@Injectable()
export class DeliveryReceiverRepository extends Repository<DeliveryReceiver> {
  constructor(entityManager?: EntityManager, dataSource?: DataSource) {
    super(DeliveryReceiver, entityManager || dataSource!.createEntityManager());
  }

  async getOneById(id: string): Promise<DeliveryReceiver> {
    const receiver = await this.createQueryBuilder('deliveryReceiver')
      .leftJoinAndSelect('deliveryReceiver.objects', 'objects')
      .where('deliveryReceiver.id = :id', { id })
      .getOne();

    if (!receiver) throw new DeliveryReceiverNotFoundException(id);

    return receiver;
  }

  async getAll(): Promise<[DeliveryReceiver[], number]> {
    const query = this.createQueryBuilder('deliveryReceiver')
      .leftJoinAndSelect('deliveryReceiver.objects', 'objects')
      .orderBy('deliveryReceiver.createdAt', 'DESC');

    return query.getManyAndCount();
  }
}
