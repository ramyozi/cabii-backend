import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { ReservationEvent } from '../../domain/entity/reservation-event.entity';

@Injectable()
export class ReservationEventRepository extends Repository<ReservationEvent> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(ReservationEvent, entityManager || dataSource!.createEntityManager());
  }

  async getAllByReservationId(
    reservationId: string,
  ): Promise<ReservationEvent[]> {
    return this.createQueryBuilder('ev')
      .where('ev.reservation_id = :reservationId', { reservationId })
      .orderBy('ev.createdAt', 'ASC')
      .getMany();
  }
}
