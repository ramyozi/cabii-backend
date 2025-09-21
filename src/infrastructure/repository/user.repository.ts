import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { User } from '../../domain/entity/user.entity';
import { EmailNotAvailableFoundException } from '../../domain/exception/user/email-not-available-found.exception';
import { PhoneNotAvailableFoundException } from '../../domain/exception/user/phone-not-available-found.exception';
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

  async getAll() {
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

  async getOneByLoginOrEmail(loginOrEmail: string) {
    const query = this.createQueryBuilder('user').where(
      'user.login = :loginOrEmail OR user.email = :loginOrEmail',
      { loginOrEmail },
    );

    const user = await query.getOne();

    if (!user) {
      throw new UserNotFoundException(`User with Id ${loginOrEmail} not found`);
    }

    return user;
  }

  async isEmailAvailable(email: string) {
    const query = this.createQueryBuilder('user').where('user.email = :email', {
      email,
    });

    if ((await query.getCount()) > 0) {
      throw new EmailNotAvailableFoundException(
        `Email ${email} is already used`,
      );
    }

    return true;
  }

  async isPhoneNumberAvailable(phone: string) {
    const query = this.createQueryBuilder('user').where('user.phone = :phone', {
      phone,
    });

    if ((await query.getCount()) > 0) {
      throw new PhoneNotAvailableFoundException(
        `Phone number ${phone} is already used`,
      );
    }

    return true;
  }
}
