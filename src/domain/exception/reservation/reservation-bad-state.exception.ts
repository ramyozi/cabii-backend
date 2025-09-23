import { BadRequestException } from '@nestjs/common';

export class ReservationBadStateException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
