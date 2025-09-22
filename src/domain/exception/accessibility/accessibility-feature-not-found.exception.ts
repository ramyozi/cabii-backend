import { NotFoundException } from '@nestjs/common';

export class AccessibilityFeatureNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`AccessibilityFeature with id ${id} not found`);
  }
}
