import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DriverLocation } from '../../domain/entity/driver-location.entity';

@Injectable()
export class DriverLocationRepository extends Repository<DriverLocation> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(DriverLocation, entityManager || dataSource!.createEntityManager());
  }

  async getLatestByDriverId(driverId: string): Promise<DriverLocation | null> {
    return this.createQueryBuilder('loc')
      .innerJoin('loc.driver', 'driver')
      .where('driver.id = :driverId', { driverId })
      .orderBy('loc.createdAt', 'DESC')
      .getOne();
  }
}
