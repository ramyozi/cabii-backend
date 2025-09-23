import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { RidePassenger } from '../../domain/entity/ride-passenger.entity';
import { RidePassengerNotFoundException } from '../../domain/exception/ride-passenger/ride-passenger-not-found.exception';

@Injectable()
export class RidePassengerRepository extends Repository<RidePassenger> {
  constructor(entityManager?: EntityManager, dataSource?: DataSource) {
    super(RidePassenger, entityManager || dataSource!.createEntityManager());
  }

  async getOneById(id: string): Promise<RidePassenger> {
    const passenger = await this.createQueryBuilder('ridePassenger')
      .leftJoinAndSelect('ridePassenger.reservation', 'reservation')
      .where('ridePassenger.id = :id', { id })
      .getOne();

    if (!passenger) throw new RidePassengerNotFoundException(id);

    return passenger;
  }

  async getAll(): Promise<[RidePassenger[], number]> {
    const query = this.createQueryBuilder('ridePassenger')
      .leftJoinAndSelect('ridePassenger.reservation', 'reservation')
      .orderBy('ridePassenger.createdAt', 'DESC');

    return query.getManyAndCount();
  }
}
