import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DriverProfile } from '../../domain/entity/driver-profile.entity';
import { DriverProfileNotFoundException } from '../../domain/exception/driver/driver-profile-not-found.exception';

@Injectable()
export class DriverProfileRepository extends Repository<DriverProfile> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(DriverProfile, entityManager || dataSource!.createEntityManager());
  }

  async getAll() {
    const query = this.createQueryBuilder('driverProfile');

    return await query.getManyAndCount();
  }

  async getOneById(driverProfileId: string) {
    const query = this.createQueryBuilder('driverProfile')
      .leftJoinAndSelect('driverProfile.vehicles', 'vehicle')
      .leftJoinAndSelect('vehicle.category', 'category')
      .where('driverProfile.id = :driverProfileId', {
        driverProfileId,
      });
    const driverProfile = await query.getOne();

    if (!driverProfile) {
      throw new DriverProfileNotFoundException(
        `DriverProfile with Id ${driverProfileId} not found`,
      );
    }

    return driverProfile;
  }

  async getOneByLoginOrEmail(loginOrEmail: string) {
    const query = this.createQueryBuilder('driverProfile').where(
      'driverProfile.login = :loginOrEmail OR driverProfile.email = :loginOrEmail',
      { loginOrEmail },
    );

    const driverProfile = await query.getOne();

    if (!driverProfile) {
      throw new DriverProfileNotFoundException(
        `DriverProfile with Id ${loginOrEmail} not found`,
      );
    }

    return driverProfile;
  }
}
