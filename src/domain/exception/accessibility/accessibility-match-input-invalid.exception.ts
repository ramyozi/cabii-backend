import { BadRequestException } from '@nestjs/common';

export class AccessibilityMatchInputInvalidException extends BadRequestException {
  constructor(message = 'userId and vehicleId are required') {
    super(message);
  }
}
