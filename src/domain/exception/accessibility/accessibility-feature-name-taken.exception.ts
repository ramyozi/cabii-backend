import { ConflictException } from '@nestjs/common';

export class AccessibilityFeatureNameTakenException extends ConflictException {
  constructor(name: string) {
    super(`AccessibilityFeature with name '${name}' already exists`);
  }
}
