import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CustomerProfile } from '../../domain/entity/customer-profile.entity';
import { CustomerProfileRepository } from '../../infrastructure/repository/customer-profile.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { CustomerProfileCreateRequestDto } from '../dto/customer/customer-profile-create-request.dto';

@Injectable()
export class CustomerProfileAppService {
  constructor(
    private readonly customerProfileRepository: CustomerProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getList() {
    return await this.customerProfileRepository.getAll();
  }

  async getOneById(customerProfileId: string) {
    return await this.customerProfileRepository.getOneById(customerProfileId);
  }

  async getOneByLogin(login: string) {
    return await this.customerProfileRepository.getOneByLoginOrEmail(login);
  }

  async create(dto: CustomerProfileCreateRequestDto): Promise<CustomerProfile> {
    const customerProfile = new CustomerProfile();

    customerProfile.user = await this.userRepository.getOneById(dto.userId);

    return await this.customerProfileRepository.save(customerProfile);
  }
}
