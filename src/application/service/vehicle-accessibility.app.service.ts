import { Injectable } from '@nestjs/common';

import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';
import { VehicleAccessibility } from '../../domain/entity/vehicle-accessibility.entity';
import { VehicleAccessibilityAlreadyExistsException } from '../../domain/exception/accessibility/vehicle-accessibility-already-exists.exception';
import { VehicleAccessibilityNotFoundException } from '../../domain/exception/accessibility/vehicle-accessibility-not-found.exception';
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

    try {
      await this.vehicleAccessibilityRepository.getByVehicleAndFeature(
        vehicleId,
        featureId,
      );

      throw new VehicleAccessibilityAlreadyExistsException(
        vehicleId,
        featureId,
      );
    } catch (error) {
      if (error instanceof VehicleAccessibilityNotFoundException) {
        const vehicleAcc = new VehicleAccessibility();

        vehicleAcc.vehicle = vehicle;
        vehicleAcc.feature = feature;

        return await this.vehicleAccessibilityRepository.save(vehicleAcc);
      }

      throw error;
    }
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

  async getAccessibilityFeaturesByVehicleId(
    vehicleId: string,
  ): Promise<ListInterface<AccessibilityFeature>> {
    const [features, count] =
      await this.vehicleAccessibilityRepository.getFeaturesByVehicleId(
        vehicleId,
      );

    const list = new ListBuilder(features, count);

    return list.build();
  }
}
