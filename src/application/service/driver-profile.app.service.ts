import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { DriverProfile } from '../../domain/entity/driver-profile.entity';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { DriverProfileCreateRequestDto } from '../dto/driver/driver-profile-create-request.dto';

@Injectable()
export class DriverProfileAppService {
  constructor(
    private readonly driverProfileRepository: DriverProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getList() {
    return await this.driverProfileRepository.getAll();
  }

  async getOneById(driverProfileId: string) {
    return await this.driverProfileRepository.getOneById(driverProfileId);
  }

  async getOneByLogin(login: string) {
    return await this.driverProfileRepository.getOneByLoginOrEmail(login);
  }

  async create(dto: DriverProfileCreateRequestDto): Promise<DriverProfile> {
    const driverProfile = new DriverProfile();

    driverProfile.user = await this.userRepository.getOneById(dto.userId);
    driverProfile.driverLicenseSerial = dto.driverLicenseSerial;
    driverProfile.isAvailable = false;

    return await this.driverProfileRepository.save(driverProfile);
  }
}
