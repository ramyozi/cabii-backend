import { NotFoundException } from '@nestjs/common';

export class UserDoesNotHaveDriverProfileException extends NotFoundException {}
