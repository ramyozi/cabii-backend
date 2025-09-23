import { ConflictException } from '@nestjs/common';

export class DriverCommissionAlreadyExistsException extends ConflictException {}
