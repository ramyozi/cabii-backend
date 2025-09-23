import { Injectable } from '@nestjs/common';

import { DriverLocation } from '../../domain/entity/driver-location.entity';
import { DriverLocationRepository } from '../../infrastructure/repository/driver-location.repository';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { DriverLocationCreateRequestDto } from '../dto/driver-location/driver-location-create-request.dto';

@Injectable()
export class DriverLocationAppService {
  constructor(
    private readonly driverRepo: DriverProfileRepository,
    private readonly locationRepo: DriverLocationRepository,
  ) {}

  async record(
    driverId: string,
    dto: DriverLocationCreateRequestDto,
  ): Promise<DriverLocation> {
    const driver = await this.driverRepo.getOneById(driverId);
    const loc = this.locationRepo.create({ driver, ...dto });

    return await this.locationRepo.save(loc);
  }

  async latest(driverId: string): Promise<DriverLocation | null> {
    await this.driverRepo.getOneById(driverId);
    return await this.locationRepo.getLatestByDriverId(driverId);
  }
}
