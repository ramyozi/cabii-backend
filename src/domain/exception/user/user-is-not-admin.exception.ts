import { ForbiddenException } from '@nestjs/common';

export class UserIsNotAdminException extends ForbiddenException {}
