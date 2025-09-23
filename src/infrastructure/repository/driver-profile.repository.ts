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
      .leftJoinAndSelect('driverProfile.activeVehicle', 'activeVehicle')
      .leftJoinAndSelect('activeVehicle.category', 'category')
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

  async getOneByEmail(email: string) {
    const query = this.createQueryBuilder('driverProfile').where(
      'driverProfile.email = :email',
      { email: email },
    );

    const driverProfile = await query.getOne();

    if (!driverProfile) {
      throw new DriverProfileNotFoundException(
        `DriverProfile with Id ${email} not found`,
      );
    }

    return driverProfile;
  }

  async getAvailableDrivers() {
    const query = this.createQueryBuilder('driverProfile')
      .leftJoinAndSelect('driverProfile.currentVehicle', 'vehicle')
      .where('driverProfile.isAvailable = :isAvailable', { isAvailable: true });

    return await query.getMany();
  }
}
