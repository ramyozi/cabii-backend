import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { Vehicle } from '../../domain/entity/vehicle.entity';
import { VehicleNotFoundException } from '../../domain/exception/vehicle/vehicle-not-found.exception';

@Injectable()
export class VehicleRepository extends Repository<Vehicle> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(Vehicle, entityManager || dataSource!.createEntityManager());
  }

  async getAll(): Promise<[Vehicle[], number]> {
    const query = this.createQueryBuilder('vehicle');

    return await query.getManyAndCount();
  }

  async getOneById(vehicleId: string) {
    const query = this.createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.driver', 'driver')
      .where('vehicle.id = :vehicleId', {
        vehicleId,
      });
    const vehicle = await query.getOne();

    if (!vehicle) {
      throw new VehicleNotFoundException(
        `Vehicle with Id ${vehicleId} not found`,
      );
    }

    return vehicle;
  }
}
