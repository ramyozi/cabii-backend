import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { JwtClaimsDto } from '../../../application/dto/auth/jwt-claims.dto';
import {
  AUTHORIZATION_HEADER,
  COOKIE_AUTH_TOKEN_NAME,
} from '../../../application/service/auth.service';

const getJwtClaimsFromContext = (ctx: ExecutionContext): JwtClaimsDto => {
  const request = ctx.switchToHttp().getRequest();
  // Get token from cookies or authorization header

  const authBearerToken =
    request.cookies?.[COOKIE_AUTH_TOKEN_NAME] ||
    request.headers?.[AUTHORIZATION_HEADER];

  const jwtToken = authBearerToken.split(' ')[1];

  const jwtClaims = jwt.verify(
    jwtToken,
    process.env.JWT_SECRET!,
  ) as jwt.JwtPayload;

  const jwtClaimsDto = new JwtClaimsDto();

  Object.assign(jwtClaimsDto, jwtClaims.claims);

  return jwtClaimsDto;
};

export const JwtClaims = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getJwtClaimsFromContext(ctx);
  },
);

export const JwtClaim = (claimName: string) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const jwtClaims = getJwtClaimsFromContext(ctx);

    return jwtClaims[claimName];
  });

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    try {
      const jwtClaims = getJwtClaimsFromContext(ctx);

      return jwtClaims.userId;
    } catch {
      return null;
    }
  },
);

export const CurrentUserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const jwtClaims = getJwtClaimsFromContext(ctx);

    return jwtClaims.userEmail;
  },
);
