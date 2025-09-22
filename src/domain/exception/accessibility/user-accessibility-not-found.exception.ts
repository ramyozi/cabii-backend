import { NotFoundException } from '@nestjs/common';

export class UserAccessibilityNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`UserAccessibility with id ${id} not found`);
  }
}
