import { ForbiddenException } from '@nestjs/common';

export class UserDoesNotHaveAnyProfileException extends ForbiddenException {}
