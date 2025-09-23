import { Injectable } from '@nestjs/common';

import { DriverCommission } from '../../domain/entity/driver-commission.entity';
import { DriverCommissionAlreadyExistsException } from '../../domain/exception/driver-commission/driver-commission-already-exists.exception';
import { DriverCommissionRepository } from '../../infrastructure/repository/driver-commission.repository';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { DriverCommissionCreateRequestDto } from '../dto/driver-commission/driver-commission-create-request.dto';
import { DriverCommissionUpdateRequestDto } from '../dto/driver-commission/driver-commission-update-request.dto';

@Injectable()
export class DriverCommissionAppService {
  constructor(
    private readonly commissionRepository: DriverCommissionRepository,
    private readonly driverProfileRepository: DriverProfileRepository,
  ) {}

  async create(
    driverId: string,
    dto: DriverCommissionCreateRequestDto,
  ): Promise<DriverCommission> {
    const driver = await this.driverProfileRepository.getOneById(driverId);

    try {
      await this.commissionRepository.getByActiveAndDriverId(true, driverId);
      throw new DriverCommissionAlreadyExistsException(
        'An active commission already exists for this driver.',
      );
    } catch {}

    const commission = new DriverCommission();

    commission.driver = driver;
    commission.type = dto.type;
    commission.percentage = dto.percentage;
    commission.fixedFee = dto.fixedFee;
    commission.active = true;

    return await this.commissionRepository.save(commission);
  }

  async update(
    id: string,
    dto: DriverCommissionUpdateRequestDto,
  ): Promise<DriverCommission> {
    const commission = await this.commissionRepository.getOneById(id);

    commission.type = dto.type ?? commission.type;
    commission.percentage = dto.percentage ?? commission.percentage;
    commission.fixedFee = dto.fixedFee ?? commission.fixedFee;
    commission.active = dto.active ?? commission.active;

    return await this.commissionRepository.save(commission);
  }

  async getActiveCommission(driverId: string): Promise<DriverCommission> {
    return this.commissionRepository.getByActiveAndDriverId(true, driverId);
  }

  async getAllByDriver(
    driverId: string,
  ): Promise<ListInterface<DriverCommission>> {
    const [commissions, count] =
      await this.commissionRepository.getAllByDriverId(driverId);

    const list = new ListBuilder(commissions, count);

    return list.build();
  }
}
