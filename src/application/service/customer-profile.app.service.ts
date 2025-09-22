import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CustomerProfile } from '../../domain/entity/customer-profile.entity';
import { CustomerProfileRepository } from '../../infrastructure/repository/customer-profile.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { CustomerProfileCreateRequestDto } from '../dto/customer/customer-profile-create-request.dto';

@Injectable()
export class CustomerProfileAppService {
  constructor(
    private readonly customerProfileRepository: CustomerProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getList(): Promise<ListInterface<CustomerProfile>> {
    const [customers, customersCount] =
      await this.customerProfileRepository.getAll();

    const list = new ListBuilder(customers, customersCount);

    return list.build();
  }

  async getOneById(customerProfileId: string) {
    return await this.customerProfileRepository.getOneById(customerProfileId);
  }

  async getOneByEmail(email: string) {
    return await this.customerProfileRepository.getOneByEmail(email);
  }

  async create(dto: CustomerProfileCreateRequestDto): Promise<CustomerProfile> {
    const customerProfile = new CustomerProfile();

    customerProfile.user = await this.userRepository.getOneById(dto.userId);

    return await this.customerProfileRepository.save(customerProfile);
  }
}
