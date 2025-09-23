import { BadRequestException } from '@nestjs/common';

export class ReservationEventTypeNotAllowedException extends BadRequestException {
  constructor(message = 'Event type not allowed for this reservation type') {
    super(message);
  }
}
