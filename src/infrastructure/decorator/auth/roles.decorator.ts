import { SetMetadata } from '@nestjs/common';

import { ROLES_METADATA_KEY } from './roles.guard';
import { ActiveRoleEnum } from '../../../domain/enums/active-role.enum';

/**
 * Decorator to set acting roles for a route.
 * Use 'public' to allow unauthenticated access.
 */
export const Roles = (roles: ActiveRoleEnum[] | 'public') =>
  SetMetadata(ROLES_METADATA_KEY, roles);
