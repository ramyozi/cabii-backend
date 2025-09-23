import { BadRequestException } from '@nestjs/common';

export class ReservationInvalidStatusTransitionException extends BadRequestException {
  constructor(from: string, to: string) {
    super(`Invalid reservation status transition: ${from} → ${to}`);
  }
}
