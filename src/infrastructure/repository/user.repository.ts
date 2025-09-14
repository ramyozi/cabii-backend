import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { User } from '../../domain/entity/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(User, entityManager || dataSource!.createEntityManager());
  }

  async getAll() {
    const query = this.createQueryBuilder('user');

    return await query.getManyAndCount();
  }
}
