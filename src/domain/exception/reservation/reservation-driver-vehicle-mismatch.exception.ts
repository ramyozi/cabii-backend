import { BadRequestException } from '@nestjs/common';

export class ReservationDriverVehicleMismatchException extends BadRequestException {
  constructor() {
    super('Driver assigned does not match the provided vehicle');
  }
}
