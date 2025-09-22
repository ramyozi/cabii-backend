import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { UserAccessibility } from '../../domain/entity/user-accessibility.entity';
import { UserAccessibilityNotFoundException } from '../../domain/exception/accessibility/user-accessibility-not-found.exception';

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

  async getById(id: string): Promise<UserAccessibility> {
    const ua = await this.createQueryBuilder('ua')
      .leftJoinAndSelect('ua.feature', 'feature')
      .leftJoinAndSelect('ua.user', 'user')
      .where('ua.id = :id', { id })
      .getOne();

    if (!ua) {
      throw new UserAccessibilityNotFoundException(id);
    }

    return ua;
  }

  async getByUserAndFeature(
    userId: string,
    featureId: string,
  ): Promise<UserAccessibility> {
    const ua = await this.createQueryBuilder('ua')
      .leftJoinAndSelect('ua.feature', 'feature')
      .leftJoinAndSelect('ua.user', 'user')
      .where('ua.user.id = :userId', { userId })
      .andWhere('ua.feature.id = :featureId', { featureId })
      .getOne();

    if (!ua) {
      throw new UserAccessibilityNotFoundException(
        `UserAccessibility not found for user ${userId} and feature ${featureId}`,
      );
    }

    return ua;
  }

  async getAllByUserId(userId: string): Promise<[UserAccessibility[], number]> {
    const query = this.createQueryBuilder('ua')
      .leftJoinAndSelect('ua.feature', 'feature')
      .where('ua.user.id = :userId', { userId });

    return query.getManyAndCount();
  }
}
