import { NotFoundException } from '@nestjs/common';

export class DriverHasNoActiveVehicleException extends NotFoundException {}
