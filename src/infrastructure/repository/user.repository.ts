import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { User } from '../../domain/entity/user.entity';
import { UserNotFoundException } from '../../domain/exception/user/user-not-found.exception';

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

  async getAll(): Promise<[User[], number]> {
    const query = this.createQueryBuilder('user');

    return await query.getManyAndCount();
  }

  async getOneById(userId: string) {
    const query = this.createQueryBuilder('user').where('user.id = :userId', {
      userId,
    });
    const user = await query.getOne();

    if (!user) {
      throw new UserNotFoundException(`User with Id ${userId} not found`);
    }

    return user;
  }

  async getOneByEmail(email: string) {
    const query = this.createQueryBuilder('user').where('user.email = :email', {
      email,
    });

    const user = await query.getOne();

    if (!user) {
      throw new UserNotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const count = await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getCount();

    return count === 0;
  }

  async isPhoneNumberAvailable(phone: string) {
    const count = await this.createQueryBuilder('user')
      .where('user.phone = :phone', { phone })
      .getCount();

    return count === 0;
  }
}
