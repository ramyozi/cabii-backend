import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { Reservation } from '../../domain/entity/reservation.entity';
import { ReservationNotFoundException } from '../../domain/exception/reservation/reservation-not-found.exception';

@Injectable()
export class ReservationRepository extends Repository<Reservation> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate ReservationRepository without dataSource or entityManager',
      );
    }

    super(Reservation, entityManager || dataSource!.createEntityManager());
  }

  async getOneById(id: string): Promise<Reservation> {
    const res = await this.createQueryBuilder('res')
      .leftJoinAndSelect('res.customer', 'customer')
      .leftJoinAndSelect('res.driver', 'driver')
      .leftJoinAndSelect('res.vehicle', 'vehicle')
      .where('res.id = :id', { id })
      .getOne();

    if (!res) throw new ReservationNotFoundException(id);

    return res;
  }

  async getAll(): Promise<[Reservation[], number]> {
    return this.createQueryBuilder('res')
      .leftJoinAndSelect('res.customer', 'customer')
      .leftJoinAndSelect('res.driver', 'driver')
      .leftJoinAndSelect('res.vehicle', 'vehicle')
      .getManyAndCount();
  }

  async getAllByCustomer(customerId: string): Promise<[Reservation[], number]> {
    return this.createQueryBuilder('res')
      .leftJoinAndSelect('res.customer', 'customer')
      .where('customer.id = :customerId', { customerId })
      .getManyAndCount();
  }

  async getAllByDriver(driverId: string): Promise<[Reservation[], number]> {
    return this.createQueryBuilder('res')
      .leftJoinAndSelect('res.driver', 'driver')
      .where('driver.id = :driverId', { driverId })
      .getManyAndCount();
  }

  async getActiveByCustomer(
    customerId: string,
  ): Promise<[Reservation[], number]> {
    return this.createQueryBuilder('res')
      .leftJoinAndSelect('res.customer', 'customer')
      .where('customer.id = :customerId', { customerId })
      .andWhere('res.status NOT IN (:...statuses)', {
        statuses: ['Completed', 'Cancelled'],
      })
      .getManyAndCount();
  }

  async getActiveByDriver(driverId: string): Promise<[Reservation[], number]> {
    return this.createQueryBuilder('res')
      .leftJoinAndSelect('res.driver', 'driver')
      .where('driver.id = :driverId', { driverId })
      .andWhere('res.status NOT IN (:...statuses)', {
        statuses: ['Completed', 'Cancelled'],
      })
      .getManyAndCount();
  }

  async getHistoryByCustomer(
    customerId: string,
  ): Promise<[Reservation[], number]> {
    return this.createQueryBuilder('res')
      .leftJoinAndSelect('res.customer', 'customer')
      .where('customer.id = :customerId', { customerId })
      .andWhere('res.status IN (:...statuses)', {
        statuses: ['Completed', 'Cancelled'],
      })
      .getManyAndCount();
  }

  async getHistoryByDriver(driverId: string): Promise<[Reservation[], number]> {
    return this.createQueryBuilder('res')
      .leftJoinAndSelect('res.driver', 'driver')
      .where('driver.id = :driverId', { driverId })
      .andWhere('res.status IN (:...statuses)', {
        statuses: ['Completed', 'Cancelled'],
      })
      .getManyAndCount();
  }
}
