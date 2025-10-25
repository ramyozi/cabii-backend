import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { validate as isUuid } from 'uuid';
import { JwtClaimsDto } from '../../../application/dto/auth/jwt-claims.dto';
import {
  AUTHORIZATION_HEADER,
  COOKIE_AUTH_TOKEN_NAME,
} from '../../../application/service/auth.service';

/**
 * Safely extract and verify JWT claims from request (cookie or header)
 */
function extractJwtClaims(ctx: ExecutionContext): JwtClaimsDto {
  const req = ctx.switchToHttp().getRequest();

  const rawToken =
    req.cookies?.[COOKIE_AUTH_TOKEN_NAME] ||
    req.headers?.[AUTHORIZATION_HEADER];

  if (!rawToken) {
    throw new UnauthorizedException('Missing authentication token');
  }

  const token = String(rawToken).startsWith('Bearer ')
    ? String(rawToken).split(' ')[1]
    : String(rawToken);

  if (!token || token.length < 10) {
    throw new UnauthorizedException('Malformed token');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    const claims = new JwtClaimsDto();
    Object.assign(claims, decoded.claims);
    return claims;
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}

export const JwtClaims = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => extractJwtClaims(ctx),
);

export const JwtClaim = (claimName: keyof JwtClaimsDto) =>
  createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const claims = extractJwtClaims(ctx);
    return claims[claimName];
  });

export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const claims = extractJwtClaims(ctx);

    if (!claims?.userId) {
      throw new UnauthorizedException('Missing userId in token');
    }
    if (!isUuid(claims.userId)) {
      throw new UnauthorizedException('Invalid userId format');
    }

    return claims.userId;
  },
);

export const CurrentUserEmail = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const claims = extractJwtClaims(ctx);
    return claims.userEmail;
  },
);
