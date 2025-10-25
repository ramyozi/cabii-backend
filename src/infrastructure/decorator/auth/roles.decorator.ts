import { Reflector } from '@nestjs/core';

import { ActiveRoleEnum } from '../../../domain/enums/active-role.enum';

/**
 * Decorator to set acting roles for a controller or route handler.
 * Use 'public' to allow unauthenticated access.
 */
export const Roles = Reflector.createDecorator<ActiveRoleEnum[] | 'public'>();
