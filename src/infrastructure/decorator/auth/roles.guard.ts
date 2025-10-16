import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ActiveRoleEnum } from '../../../domain/enums/active-role.enum';

export const ROLES_METADATA_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<ActiveRoleEnum[] | 'public'>(
      ROLES_METADATA_KEY,
      context.getHandler(),
    );

    if (requiredRoles === 'public') return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No authenticated user found in request.');
    }

    const activeRole: ActiveRoleEnum | undefined =
      user.activeRole ?? user.claims?.activeRole;

    if (!activeRole) {
      throw new ForbiddenException('No activeRole found in JWT claims.');
    }

    if (!requiredRoles || requiredRoles.length === 0) return true;

    if (!requiredRoles.includes(activeRole)) {
      throw new ForbiddenException(
        `Requires active role: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
