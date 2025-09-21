import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { VehicleCategory } from '../../domain/entity/vehicle-category.entity';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { VehicleCategoryRepository } from '../../infrastructure/repository/vehicle-category.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { VehicleCategoryCreateRequestDto } from '../dto/vehicle-category/vehicle-category-create-request.dto';

@Injectable()
export class VehicleCategoryAppService {
  constructor(
    private readonly vehicleCategoryRepository: VehicleCategoryRepository,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getList(): Promise<ListInterface<VehicleCategory>> {
    const [categories, categoriesCount] =
      await this.vehicleCategoryRepository.getAll();

    const list = new ListBuilder(categories, categoriesCount);

    return list.build();
  }

  async getOneById(vehicleCategoryId: string) {
    return await this.vehicleCategoryRepository.getOneById(vehicleCategoryId);
  }

  async create(dto: VehicleCategoryCreateRequestDto): Promise<VehicleCategory> {
    const vehicleCategory = new VehicleCategory();

    vehicleCategory.name = dto.name;
    vehicleCategory.description = dto.description;
    vehicleCategory.icon = dto.icon;
    vehicleCategory.costPerKm = dto.costPerKm;
    vehicleCategory.maxPassengers = dto.maxPassengers;

    return await this.vehicleCategoryRepository.save(vehicleCategory);
  }
}
