import { NotFoundException } from '@nestjs/common';

export class UserDoesNotHaveCustomerProfileException extends NotFoundException {}
