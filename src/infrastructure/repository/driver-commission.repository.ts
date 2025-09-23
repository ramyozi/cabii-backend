import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DriverCommission } from '../../domain/entity/driver-commission.entity';
import { DriverCommissionNotFoundException } from '../../domain/exception/driver-commission/driver-commission-not-found.exception';

@Injectable()
export class DriverCommissionRepository extends Repository<DriverCommission> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(DriverCommission, entityManager || dataSource!.createEntityManager());
  }

  async getOneById(id: string): Promise<DriverCommission> {
    const commission = await this.createQueryBuilder('c')
      .innerJoin('c.driver', 'driver')
      .where('c.id = :id', { id })
      .getOne();

    if (!commission) {
      throw new DriverCommissionNotFoundException(id);
    }

    return commission;
  }

  async getByActiveAndDriverId(
    active: boolean,
    driverId: string,
  ): Promise<DriverCommission> {
    const commission = await this.createQueryBuilder('c')
      .innerJoin('c.driver', 'driver')
      .where('driver.id = :driverId', { driverId })
      .andWhere('c.active = :active', { active })
      .getOne();

    if (!commission) {
      throw new DriverCommissionNotFoundException(
        `active for driver ${driverId}`,
      );
    }

    return commission;
  }

  async getAllByDriverId(
    driverId: string,
  ): Promise<[DriverCommission[], number]> {
    const query = this.createQueryBuilder('c')
      .innerJoin('c.driver', 'driver')
      .where('driver.id = :driverId', { driverId });

    return query.getManyAndCount();
  }
}
