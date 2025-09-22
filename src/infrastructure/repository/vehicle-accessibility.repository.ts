import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { VehicleAccessibility } from '../../domain/entity/vehicle-accessibility.entity';

@Injectable()
export class VehicleAccessibilityRepository extends Repository<VehicleAccessibility> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(
      VehicleAccessibility,
      entityManager || dataSource!.createEntityManager(),
    );
  }
}
