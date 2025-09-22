import { Injectable } from '@nestjs/common';

import { Vehicle } from '../../domain/entity/vehicle.entity';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { VehicleCategoryRepository } from '../../infrastructure/repository/vehicle-category.repository';
import { VehicleRepository } from '../../infrastructure/repository/vehicle.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { VehicleCreateRequestDto } from '../dto/vehicle/vehicle-create-request.dto';

@Injectable()
export class VehicleAppService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly driverProfileRepository: DriverProfileRepository,
    private readonly vehicleCategoryRepository: VehicleCategoryRepository,
  ) {}

  async getList(): Promise<ListInterface<Vehicle>> {
    const [vehicles, vehiclesCount] = await this.vehicleRepository.getAll();

    const list = new ListBuilder(vehicles, vehiclesCount);

    return list.build();
  }

  async getOneById(vehicleId: string) {
    return await this.vehicleRepository.getOneById(vehicleId);
  }

  async create(dto: VehicleCreateRequestDto): Promise<Vehicle> {
    const vehicle = new Vehicle();

    vehicle.brand = dto.brand;
    vehicle.model = dto.model;
    vehicle.plate = dto.plate;
    vehicle.color = dto.color;
    vehicle.year = dto.year;
    vehicle.chassisNumber = dto.chassisNumber;

    vehicle.driver = await this.driverProfileRepository.getOneById(
      dto.driverId,
    );

    vehicle.category = await this.vehicleCategoryRepository.getOneById(
      dto.categoryId,
    );

    return await this.vehicleRepository.save(vehicle);
  }
}
