import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { CustomerProfile } from '../../domain/entity/customer-profile.entity';

@Injectable()
export class CustomerProfileRepository extends Repository<CustomerProfile> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(CustomerProfile, entityManager || dataSource!.createEntityManager());
  }

  async getAll() {
    const query = this.createQueryBuilder('customerProfile');

    return await query.getManyAndCount();
  }

  async getOneById(customerProfileId: string) {
    const query = this.createQueryBuilder('customerProfile').where(
      'customerProfile.id = :customerProfileId',
      {
        customerProfileId,
      },
    );
    const customerProfile = await query.getOne();

    if (!customerProfile) {
      throw new NotFoundException(
        `CustomerProfile with Id ${customerProfileId} not found`,
      );
    }

    return customerProfile;
  }

  async getOneByLoginOrEmail(loginOrEmail: string) {
    const query = this.createQueryBuilder('customerProfile').where(
      'customerProfile.login = :loginOrEmail OR customerProfile.email = :loginOrEmail',
      { loginOrEmail },
    );

    const customerProfile = await query.getOne();

    if (!customerProfile) {
      throw new NotFoundException(
        `CustomerProfile with Id ${loginOrEmail} not found`,
      );
    }

    return customerProfile;
  }
}
