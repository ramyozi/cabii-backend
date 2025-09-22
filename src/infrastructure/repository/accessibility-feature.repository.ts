import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';

@Injectable()
export class AccessibilityFeatureRepository extends Repository<AccessibilityFeature> {
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
      AccessibilityFeature,
      entityManager || dataSource!.createEntityManager(),
    );
  }

  async getAll(): Promise<[AccessibilityFeature[], number]> {
    return this.createQueryBuilder('feature').getManyAndCount();
  }

  async getOneById(id: string): Promise<AccessibilityFeature> {
    const feature = await this.findOneBy({ id });

    if (!feature) {
      throw new Error(`AccessibilityFeature with id ${id} not found`);
    }

    return feature;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const count = await this.createQueryBuilder('feature')
      .where('feature.name = :name', { name })
      .getCount();

    return count === 0;
  }
}
