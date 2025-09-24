import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleEnum } from '../../../domain/enums/role.enum';

export const ROLES_METADATA_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleEnum[] | 'public'>(
      ROLES_METADATA_KEY,
      ctx.getHandler(),
    );

    if (roles === 'public') return true; // no auth required

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('No user claims found');

    if (!roles || roles.length === 0) return true; // only JWT required

    if (!roles.includes(user.activeRole)) {
      throw new ForbiddenException(`Requires active role: ${roles.join(', ')}`);
    }

    return true;
  }
}
