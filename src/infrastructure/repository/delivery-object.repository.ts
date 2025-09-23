import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DeliveryObject } from '../../domain/entity/delivery-object.entity';
import { DeliveryObjectNotFoundException } from '../../domain/exception/delivery-object/delivery-object-not-found.exception';

@Injectable()
export class DeliveryObjectRepository extends Repository<DeliveryObject> {
  constructor(entityManager?: EntityManager, dataSource?: DataSource) {
    super(DeliveryObject, entityManager || dataSource!.createEntityManager());
  }

  async getOneById(id: string): Promise<DeliveryObject> {
    const obj = await this.createQueryBuilder('deliveryObject')
      .leftJoinAndSelect('deliveryObject.reservation', 'reservation')
      .leftJoinAndSelect('deliveryObject.receiver', 'receiver')
      .where('deliveryObject.id = :id', { id })
      .getOne();

    if (!obj) throw new DeliveryObjectNotFoundException(id);

    return obj;
  }

  async getAll(): Promise<[DeliveryObject[], number]> {
    const query = this.createQueryBuilder('deliveryObject')
      .leftJoinAndSelect('deliveryObject.reservation', 'reservation')
      .leftJoinAndSelect('deliveryObject.receiver', 'receiver')
      .orderBy('deliveryObject.createdAt', 'DESC');

    return query.getManyAndCount();
  }
}
