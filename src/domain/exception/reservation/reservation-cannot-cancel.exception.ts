import { BadRequestException } from '@nestjs/common';

export class ReservationCannotCancelException extends BadRequestException {
  constructor(status: string) {
    super(`Reservation cannot be cancelled when in status: ${status}`);
  }
}
