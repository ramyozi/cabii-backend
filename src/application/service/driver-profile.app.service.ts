import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { DriverProfile } from '../../domain/entity/driver-profile.entity';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { DriverProfileCreateRequestDto } from '../dto/driver/driver-profile-create-request.dto';

@Injectable()
export class DriverProfileAppService {
  constructor(
    private readonly driverProfileRepository: DriverProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getList(): Promise<ListInterface<DriverProfile>> {
    const [drivers, driversCount] = await this.driverProfileRepository.getAll();

    const list = new ListBuilder(drivers, driversCount);

    return list.build();
  }

  async getOneById(driverProfileId: string) {
    return await this.driverProfileRepository.getOneById(driverProfileId);
  }

  async getOneByEmail(email: string) {
    return await this.driverProfileRepository.getOneByEmail(email);
  }

  async create(dto: DriverProfileCreateRequestDto): Promise<DriverProfile> {
    const driverProfile = new DriverProfile();

    driverProfile.user = await this.userRepository.getOneById(dto.userId);
    driverProfile.driverLicenseSerial = dto.driverLicenseSerial;
    driverProfile.isAvailable = false;

    return await this.driverProfileRepository.save(driverProfile);
  }
}
