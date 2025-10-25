import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { JwtClaimsDto } from '../../../application/dto/auth/jwt-claims.dto';
import {
  AUTHORIZATION_HEADER,
  COOKIE_AUTH_TOKEN_NAME,
} from '../../../application/service/auth.service';
import { ActiveRoleEnum } from '../../../domain/enums/active-role.enum';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<ActiveRoleEnum[] | 'public'>(
      Roles,
      context.getHandler(),
    );

    // Public route: skip verification
    if (requiredRoles === 'public') return true;

    const req = context.switchToHttp().getRequest();

    const raw =
      req.headers?.authorization ||
      req.cookies?.[COOKIE_AUTH_TOKEN_NAME];

    if (!raw) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const token = String(raw).startsWith('Bearer ')
      ? String(raw).split(' ')[1]
      : String(raw);

    if (!token) {
      throw new UnauthorizedException('Malformed token');
    }

    let claims: JwtClaimsDto;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as jwt.JwtPayload;

      claims = new JwtClaimsDto();
      Object.assign(claims, decoded.claims);

      req.jwtClaims = claims;
      req.user = {
        id: claims.userId,
        email: claims.userEmail,
        activeRole: claims.activeRole,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // No role restriction
    if (!requiredRoles || requiredRoles.length === 0) return true;

    if (!requiredRoles.includes(claims.activeRole)) {
      throw new ForbiddenException(
        `Role ${claims.activeRole} not allowed on this route`,
      );
    }

    return true;
  }
}
