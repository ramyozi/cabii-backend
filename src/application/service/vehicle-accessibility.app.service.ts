import { Injectable } from '@nestjs/common';

import { VehicleAccessibility } from '../../domain/entity/vehicle-accessibility.entity';
import { AccessibilityFeatureRepository } from '../../infrastructure/repository/accessibility-feature.repository';
import { VehicleAccessibilityRepository } from '../../infrastructure/repository/vehicle-accessibility.repository';
import { VehicleRepository } from '../../infrastructure/repository/vehicle.repository';
import { ListBuilder, ListInterface } from '../common/list';

@Injectable()
export class VehicleAccessibilityAppService {
  constructor(
    private readonly vehicleAccessibilityRepository: VehicleAccessibilityRepository,
    private readonly accessibilityFeatureRepository: AccessibilityFeatureRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async addFeatureToVehicle(
    vehicleId: string,
    featureId: string,
  ): Promise<VehicleAccessibility> {
    const vehicle = await this.vehicleRepository.getOneById(vehicleId);
    const feature =
      await this.accessibilityFeatureRepository.getOneById(featureId);

    const vehicleAcc = new VehicleAccessibility();

    vehicleAcc.vehicle = vehicle;
    vehicleAcc.feature = feature;

    return await this.vehicleAccessibilityRepository.save(vehicleAcc);
  }

  async removeFeatureFromVehicle(
    vehicleId: string,
    featureId: string,
  ): Promise<void> {
    const vehicleAcc =
      await this.vehicleAccessibilityRepository.getByVehicleAndFeature(
        vehicleId,
        featureId,
      );

    await this.vehicleAccessibilityRepository.remove(vehicleAcc);
  }

  async getVehicleAccessibility(
    vehicleId: string,
  ): Promise<ListInterface<VehicleAccessibility>> {
    const [vehicleAccessibilities, count] =
      await this.vehicleAccessibilityRepository.getAllByVehicleId(vehicleId);

    return new ListBuilder(vehicleAccessibilities, count).build();
  }
}
