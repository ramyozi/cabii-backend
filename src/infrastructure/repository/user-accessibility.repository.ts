import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { UserAccessibility } from '../../domain/entity/user-accessibility.entity';

@Injectable()
export class UserAccessibilityRepository extends Repository<UserAccessibility> {
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
      UserAccessibility,
      entityManager || dataSource!.createEntityManager(),
    );
  }
}
