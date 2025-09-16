import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CookieOptions, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { AuthSessionService } from './auth-session.service';
import { User } from '../../domain/entity/user.entity';
import { Hash } from '../../infrastructure/common/hash.utils';
import { Time } from '../../infrastructure/common/time.utils';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { AuthTokenDto } from '../dto/auth/auth-token.dto';
import { JwtClaimsDto } from '../dto/auth/jwt-claims.dto';
import { SignInRequestDto } from '../dto/auth/sign-in-request.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private jwtExpiresIn: string;
  private readonly jwtAlgorithm: jwt.Algorithm;
  private readonly passwordSalt: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly authSessionService: AuthSessionService,
  ) {
    this.jwtSecret = process.env.JWT_SECRET || '';
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    this.jwtExpiresIn = '30m';
    this.jwtAlgorithm = 'HS512';

    this.passwordSalt = process.env.PASSWORD_SALT || '';
  }

  async signIn(signInDto: SignInRequestDto): Promise<AuthTokenDto> {
    const user = await this.userRepository.getOneByLoginOrEmail(
      signInDto.login,
    );
    const hashedPassword = this.hashPassword(signInDto.password);

    if (user.password !== hashedPassword) {
      throw new Error('Wrong password');
    }

    const authSession = await this.authSessionService.createAuthSession(
      user,
      Time.fromDays(15).minutes,
    );

    const authTokenDto = new AuthTokenDto();

    authTokenDto.accessToken = await this.generateJwtToken(user);
    authTokenDto.refreshToken = authSession.refreshToken;

    return authTokenDto;
  }

  async refresh(refreshToken: string): Promise<AuthTokenDto> {
    const authSession =
      await this.authSessionService.getSessionByRefreshToken(refreshToken);

    const user = await this.userRepository.getOneById(authSession.user.id);

    const newAuthSession = await this.authSessionService.refreshAuthSession(
      authSession,
      Time.fromDays(15).minutes,
    );

    const authTokenDto = new AuthTokenDto();

    authTokenDto.accessToken = await this.generateJwtToken(user);
    authTokenDto.refreshToken = newAuthSession.refreshToken;

    return authTokenDto;
  }

  public async revokeRefreshToken(refreshToken: string): Promise<void> {
    const authSession =
      await this.authSessionService.getSessionByRefreshToken(refreshToken);

    await this.authSessionService.revokeAuthSession(authSession);
  }

  public async generateJwtToken(user: User): Promise<string> {
    const claims = await this.generateJwtClaims(user);

    return jwt.sign({ claims }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      algorithm: this.jwtAlgorithm,
    });
  }

  public hashPassword(password: string): string {
    const saltedPassword = this.passwordSalt + password;

    return Hash.from(saltedPassword).sha512();
  }

  public async generateJwtClaims(user: User): Promise<JwtClaimsDto> {
    const claims = new JwtClaimsDto();

    claims.userEmail = user.email;
    claims.userId = user.id;

    await validateOrReject(claims);
    return claims;
  }

  public async decodeToken(token: string): Promise<JwtClaimsDto> {
    const decodedToken = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
    const claimsDto = new JwtClaimsDto();

    Object.assign(claimsDto, decodedToken.claims);

    await validateOrReject(claimsDto);
    return claimsDto;
  }

  private getCookiesOptions(maxDurationInMilli: number): CookieOptions {
    const expirationDate = new Date(Date.now() + maxDurationInMilli);

    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.FRONTEND_DOMAIN,
      expires: expirationDate,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };
  }

  public setCookie(res: Response, authTokenDto: AuthTokenDto): void {
    res.cookie(
      COOKIE_AUTH_TOKEN_NAME,
      `Bearer ${authTokenDto.accessToken}`,
      this.getCookiesOptions(Time.fromMinutes(30).milliseconds),
    );
    res.cookie(
      COOKIE_REFRESH_TOKEN_NAME,
      authTokenDto.refreshToken,
      this.getCookiesOptions(Time.fromDays(15).milliseconds),
    );
  }

  public clearCookie(res: Response): void {
    const cookiesOptions = this.getCookiesOptions(0);

    cookiesOptions.expires = undefined;
    res.clearCookie(COOKIE_AUTH_TOKEN_NAME, cookiesOptions);
    res.clearCookie(COOKIE_REFRESH_TOKEN_NAME, cookiesOptions);
  }

  public setJwtExpiresInForTests(expiresIn: string) {
    if (process.env.JWT_SECRET !== 'JWT_TEST_SECRET') {
      this.jwtExpiresIn = expiresIn;
    }
  }
}

export const COOKIE_AUTH_TOKEN_NAME = 'access_token';
export const COOKIE_REFRESH_TOKEN_NAME = 'refresh_token';
export const REFRESH_TOKEN_HEADER = 'refresh-token';
export const AUTHORIZATION_HEADER = 'authorization';
export const X_SECRET_API_KEY_HEADER = 'x-secret-api-key';
