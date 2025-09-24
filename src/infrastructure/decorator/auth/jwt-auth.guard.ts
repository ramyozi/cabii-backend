import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

import { ROLES_METADATA_KEY } from './roles.guard';
import { JwtClaimsDto } from '../../../application/dto/auth/jwt-claims.dto';
import {
  AUTHORIZATION_HEADER,
  COOKIE_AUTH_TOKEN_NAME,
} from '../../../application/service/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ✅ Check if route is public
    const roles = this.reflector.get<string | string[]>(
      ROLES_METADATA_KEY,
      context.getHandler(),
    );

    if (roles === 'public') return true;

    const req = context.switchToHttp().getRequest();

    const bearer =
      req.cookies?.[COOKIE_AUTH_TOKEN_NAME] ||
      req.headers?.[AUTHORIZATION_HEADER];

    if (!bearer) throw new UnauthorizedException('Missing token');

    const token = String(bearer).startsWith('Bearer ')
      ? String(bearer).split(' ')[1]
      : String(bearer);

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as jwt.JwtPayload;
      const claims = new JwtClaimsDto();

      Object.assign(claims, decoded.claims);
      req.user = {
        id: claims.userId,
        email: claims.userEmail,
        role: claims.activeRole,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
