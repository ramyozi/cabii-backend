import { BadRequestException } from '@nestjs/common';

export class ReservationInvalidStateException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
