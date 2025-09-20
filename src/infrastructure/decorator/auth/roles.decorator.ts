import { Reflector } from '@nestjs/core';

import { RoleEnum } from '../../../domain/enums/role.enum';

/**
 * Decorator to set roles for a controller or a route handler.
 * By default all routes need to be authenticated, without any role.
 * If you want to allow public access to a route, you can use the 'public' keyword.
 * @Param roles: string[] | 'public'
 */
export const Roles = Reflector.createDecorator<RoleEnum[] | 'public'>();
