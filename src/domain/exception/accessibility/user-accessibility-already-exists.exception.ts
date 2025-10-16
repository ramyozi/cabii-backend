import { ConflictException } from '@nestjs/common';

export class UserAccessibilityAlreadyExistsException extends ConflictException {
  constructor(userId: string, featureId: string) {
    super(
      `AccessibilityFeature with id '${featureId}' is already linked to User '${userId}'`,
    );
  }
}
