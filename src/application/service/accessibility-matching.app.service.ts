import { Injectable } from '@nestjs/common';

import { AccessibilityMatchInputInvalidException } from '../../domain/exception/accessibility/accessibility-match-input-invalid.exception';
import { UserAccessibilityRepository } from '../../infrastructure/repository/user-accessibility.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { VehicleAccessibilityRepository } from '../../infrastructure/repository/vehicle-accessibility.repository';
import { VehicleRepository } from '../../infrastructure/repository/vehicle.repository';

@Injectable()
export class AccessibilityMatchingAppService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly vehicleRepo: VehicleRepository,
    private readonly userAccRepo: UserAccessibilityRepository,
    private readonly vehicleAccRepo: VehicleAccessibilityRepository,
  ) {}

  /**
   * Returns { isCompatible, missingFeatures }
   * - isCompatible = true if every user feature exists in vehicle features
   */
  async match(
    userId: string,
    vehicleId: string,
  ): Promise<{
    isCompatible: boolean;
    missingFeatures: string[];
  }> {
    if (!userId || !vehicleId) {
      throw new AccessibilityMatchInputInvalidException();
    }

    await this.userRepo.getOneById(userId);
    await this.vehicleRepo.getOneById(vehicleId);

    const [userFeatures, userFeaturesCount] =
      await this.userAccRepo.getFeaturesByUserId(userId);
    const [vehicleFeatures] =
      await this.vehicleAccRepo.getFeaturesByVehicleId(vehicleId);

    if (userFeaturesCount === 0) {
      return { isCompatible: true, missingFeatures: [] };
    }

    const vehicleSet = new Set(
      vehicleFeatures.map((f) => f.name.toLowerCase()),
    );
    const missing = userFeatures
      .map((f) => f.name)
      .filter((need) => !vehicleSet.has(need.toLowerCase()));

    return {
      isCompatible: missing.length === 0,
      missingFeatures: missing,
    };
  }
}
