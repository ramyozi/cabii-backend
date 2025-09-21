import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { VehicleCategory } from '../../domain/entity/vehicle-category.entity';
import { VehicleCategoryNotFoundException } from '../../domain/exception/vehicle-category/vehicle-category-not-found.exception';

@Injectable()
export class VehicleCategoryRepository extends Repository<VehicleCategory> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(VehicleCategory, entityManager || dataSource!.createEntityManager());
  }

  async getAll() {
    const query = this.createQueryBuilder('vehicleCategory');

    return await query.getManyAndCount();
  }

  async getOneById(vehicleCategoryId: string) {
    const query = this.createQueryBuilder('vehicleCategory').where(
      'vehicleCategory.id = :vehicleCategoryId',
      {
        vehicleCategoryId,
      },
    );
    const vehicleCategory = await query.getOne();

    if (!vehicleCategory) {
      throw new VehicleCategoryNotFoundException(
        `VehicleCategory with Id ${vehicleCategoryId} not found`,
      );
    }

    return vehicleCategory;
  }
}
