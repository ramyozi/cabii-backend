import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import express from 'express';

import { AuthTokenResponseDto } from '../../application/dto/auth/auth-token-response.dto';
import { RefreshAuthRequestDto } from '../../application/dto/auth/refresh-auth-request.dto';
import { SignInRequestDto } from '../../application/dto/auth/sign-in-request.dto';
import { SwitchRoleDto } from '../../application/dto/auth/switch-role.dto';
import { BaseResponseDto } from '../../application/dto/base.response.dto';
import {
  AuthService,
  COOKIE_REFRESH_TOKEN_NAME,
  REFRESH_TOKEN_HEADER,
} from '../../application/service/auth.service';
import { Time } from '../common/time.utils';
import { JwtAuthGuard } from '../decorator/auth/jwt-auth.guard';
import { CurrentUserId } from '../decorator/auth/jwt-claim.decorator';
import { Roles } from '../decorator/auth/roles.decorator';
import { RolesGuard } from '../decorator/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in user and issue tokens' })
  @ApiResponse({ type: AuthTokenResponseDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles('public')
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

      this.authService.setCookie(res, tokens);

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

      throw error;
    }
  }

  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiResponse({
    type: AuthTokenResponseDto,
    status: HttpStatus.OK,
  })
  @Post('refresh')
  @Roles('public')
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

  @ApiOperation({ summary: 'Sign out user' })
  @ApiResponse({
    type: AuthTokenResponseDto,
    status: HttpStatus.OK,
    description: 'Authentication tokens.',
  })
  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({ summary: 'Switch acting role (driver/customer/admin)' })
  @ApiResponse({ type: BaseResponseDto, status: HttpStatus.OK })
  @Post('switch-role')
  @HttpCode(HttpStatus.OK)
  async switchRole(
    @CurrentUserId() userId: string,
    @Body(new ValidationPipe()) body: SwitchRoleDto,
    @Res() res: express.Response,
  ) {
    const tokens = await this.authService.switchRole(userId, body.activeRole);

    this.authService.setCookie(res, tokens);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: tokens,
    });
  }
}
