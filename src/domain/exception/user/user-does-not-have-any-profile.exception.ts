import { NotFoundException } from '@nestjs/common';

export class UserDoesNotHaveAnyProfileException extends NotFoundException {}
