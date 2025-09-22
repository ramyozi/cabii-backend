import { ConflictException } from '@nestjs/common';

export class VehicleAccessibilityAlreadyExistsException extends ConflictException {
  constructor(vehicleId: string, featureId: string) {
    super(
      `AccessibilityFeature with id '${featureId}' is already linked to Vehicle '${vehicleId}'`,
    );
  }
}
