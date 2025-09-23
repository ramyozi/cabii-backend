import { BadRequestException } from '@nestjs/common';

export class VehicleDoesNotBelongToDriverException extends BadRequestException {}
