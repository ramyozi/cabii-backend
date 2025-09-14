import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import express from 'express';

import { RefreshAuthRequestDto } from '../../application/dto/auth/refresh-auth-request.dto';
import { SignInRequestDto } from '../../application/dto/auth/sign-in-request.dto';
import {
  AuthService,
  COOKIE_REFRESH_TOKEN_NAME,
  REFRESH_TOKEN_HEADER,
} from '../../application/service/auth.service';
import { Time } from '../common/time.utils';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Req() req: express.Request,
    @Res() res: express.Response,
    @Body(ValidationPipe) signInRequest: SignInRequestDto,
  ) {
    const requestDuration = Time.fromSeconds(1).milliseconds;
    const requestStartTime = Date.now();

    try {
      const tokens = await this.authService.signIn(signInRequest);

      const requestDurationInMilliseconds = Date.now() - requestStartTime;

      if (requestDurationInMilliseconds < requestDuration) {
        await new Promise((resolve) =>
          setTimeout(resolve, requestDuration - requestDurationInMilliseconds),
        );
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: instanceToPlain(tokens),
      });
    } catch (error) {
      const requestDurationInMilliseconds = Date.now() - requestStartTime;

      if (requestDurationInMilliseconds < requestDuration) {
        await new Promise((resolve) =>
          setTimeout(resolve, requestDuration - requestDurationInMilliseconds),
        );
      }
      // definir quelle type des erreurs on veut throw

      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: express.Request,
    @Res() res: express.Response,
    @Body(new ValidationPipe()) refreshAuthRequest: RefreshAuthRequestDto,
  ) {
    const refreshToken =
      req.cookies?.[COOKIE_REFRESH_TOKEN_NAME] ||
      req.headers?.[REFRESH_TOKEN_HEADER] ||
      refreshAuthRequest.refreshToken;

    const tokens = await this.authService.refresh(refreshToken);

    this.authService.setCookie(res, tokens);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: instanceToPlain(tokens),
    });
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req: express.Request, @Res() res: express.Response) {
    const refreshToken =
      req.cookies?.[COOKIE_REFRESH_TOKEN_NAME] ||
      req.headers?.[REFRESH_TOKEN_HEADER];

    await this.authService.revokeRefreshToken(refreshToken);

    this.authService.clearCookie(res);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User signed out successfully',
    });
  }
}
