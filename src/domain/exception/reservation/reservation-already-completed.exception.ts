import { BadRequestException } from '@nestjs/common';

export class ReservationAlreadyCompletedException extends BadRequestException {
  constructor() {
    super('Reservation has already been completed and cannot be modified');
  }
}
