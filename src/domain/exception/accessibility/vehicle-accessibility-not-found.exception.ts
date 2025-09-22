import { NotFoundException } from '@nestjs/common';

export class VehicleAccessibilityNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`VehicleAccessibility with id ${id} not found`);
  }
}
