import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';
import { AccessibilityFeatureNotFoundException } from '../../domain/exception/accessibility/accessibility-feature-not-found.exception';

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

  async getOneById(id: string): Promise<AccessibilityFeature> {
    const feature = await this.findOne({ where: { id } });

    if (!feature) {
      throw new AccessibilityFeatureNotFoundException(id);
    }

    return feature;
  }

  async getAll(): Promise<[AccessibilityFeature[], number]> {
    return this.createQueryBuilder('feature').getManyAndCount();
  }

  async getByName(name: string): Promise<AccessibilityFeature> {
    const feature = await this.findOne({ where: { name } });

    if (!feature) {
      throw new AccessibilityFeatureNotFoundException(
        `AccessibilityFeature with name '${name}' not found`,
      );
    }

    return feature;
  }
}
