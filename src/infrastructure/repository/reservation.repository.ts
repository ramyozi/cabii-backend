import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { Reservation } from '../../domain/entity/reservation.entity';
import { ReservationStatusEnum } from '../../domain/enums/reservation-status.enum';
import { ReservationNotFoundException } from '../../domain/exception/reservation/reservation-not-found.exception';

@Injectable()
export class ReservationRepository extends Repository<Reservation> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(Reservation, entityManager || dataSource!.createEntityManager());
  }

  async getOneById(id: string): Promise<Reservation> {
    const res = await this.createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'user')
      .leftJoinAndSelect('r.driver', 'driver')
      .leftJoinAndSelect('r.vehicle', 'vehicle')
      .where('r.id = :id', { id })
      .getOne();

    if (!res)
      throw new ReservationNotFoundException(
        `Reservation with Id ${id} not found`,
      );

    return res;
  }

  async getAll(): Promise<[Reservation[], number]> {
    const qb = this.createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'user')
      .leftJoinAndSelect('r.driver', 'driver')
      .leftJoinAndSelect('r.vehicle', 'vehicle')
      .orderBy('r.createdAt', 'DESC');

    return qb.getManyAndCount();
  }

  async getAllByUserId(userId: string): Promise<[Reservation[], number]> {
    const qb = this.createQueryBuilder('r')
      .leftJoin('r.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('r.createdAt', 'DESC');

    return qb.getManyAndCount();
  }

  async getAllByStatus(
    status: ReservationStatusEnum,
  ): Promise<[Reservation[], number]> {
    const qb = this.createQueryBuilder('r')
      .where('r.status = :status', { status })
      .orderBy('r.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
