import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CookieOptions, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { AuthSessionService } from './auth-session.service';
import { User } from '../../domain/entity/user.entity';
import { ActiveRoleEnum } from '../../domain/enums/active-role.enum';
import { RoleEnum } from '../../domain/enums/role.enum';
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
    const user = await this.userRepository.getOneByEmail(signInDto.email);
    const hashedPassword = this.hashPassword(signInDto.password);

    if (user.password !== hashedPassword) {
      throw new Error('Wrong password');
    }

    const activeRole = await this.resolveActiveRole(user, signInDto.activeRole);

    const authSession = await this.authSessionService.createAuthSession(
      user,
      Time.fromDays(15).minutes,
    );

    const authTokenDto = new AuthTokenDto();

    authTokenDto.accessToken = await this.generateJwtToken(user, activeRole);
    authTokenDto.refreshToken = authSession.refreshToken;

    return authTokenDto;
  }

  public async switchRole(
    userId: string,
    nextRole: ActiveRoleEnum,
  ): Promise<AuthTokenDto> {
    const user = await this.userRepository.getOneById(userId);

    // Ensure user actually has the requested profile
    await this.ensureUserHasProfileForRole(user, nextRole);

    // Safety: block if user has active reservations under current role
    const hasActive = await this.hasActiveWorkInAnyRole(userId);

    if (hasActive)
      throw new Error('Cannot switch role while you have active reservations');

    const tokens = new AuthTokenDto();

    tokens.accessToken = await this.generateJwtToken(user, nextRole);

    // keep refresh token as-is (session unchanged)
    const lastSession = await this.authSessionService.createAuthSession(
      user,
      Time.fromDays(15).minutes,
    );

    tokens.refreshToken = lastSession.refreshToken;
    return tokens;
  }

  private async resolveActiveRole(
    user: User,
    preferred?: ActiveRoleEnum,
  ): Promise<ActiveRoleEnum> {
    if (preferred) {
      await this.ensureUserHasProfileForRole(user, preferred);
      return preferred;
    }

    // default: Admin => ADMIN; else prefer CUSTOMER if exists else DRIVER
    if (user.role === RoleEnum.Admin) return ActiveRoleEnum.Admin;

    if (user.customerProfile) return ActiveRoleEnum.Customer;

    if (user.driverProfile) return ActiveRoleEnum.Driver;

    // fallback
    return ActiveRoleEnum.Customer;
  }

  private async ensureUserHasProfileForRole(user: User, role: ActiveRoleEnum) {
    console.log('role', role, 'user', user);
    if (role === ActiveRoleEnum.Admin && user.role !== RoleEnum.Admin) {
      throw new Error('Not an admin');
    }

    if (role === ActiveRoleEnum.Driver && !user.driverProfile) {
      throw new Error('Driver profile required');
    }

    if (role === ActiveRoleEnum.Customer && !user.customerProfile) {
      throw new Error('Customer profile required');
    }
  }

  private async hasActiveWorkInAnyRole(userId: string): Promise<boolean> {
    // TODO

    /* un truc du style

    const driverId = (await this.userRepository.getOneById(userId))
      .driverProfile?.id;
    const customerId = (await this.userRepository.getOneById(userId))
      .customerProfile?.id;

    const hasDriverActive = driverId
      ? await this.reservationRepo.existsActiveByDriverId(driverId)
      : false;

    const hasCustomerActive = customerId
      ? await this.reservationRepo.existsActiveByCustomerId(customerId)
      : false;

          return hasDriverActive || hasCustomerActive;

     */

    return false;
  }

  async refresh(refreshToken: string): Promise<AuthTokenDto> {
    const authSession =
      await this.authSessionService.getSessionByRefreshToken(refreshToken);

    const user = await this.userRepository.getOneById(authSession.user.id);

    const newAuthSession = await this.authSessionService.refreshAuthSession(
      authSession,
      Time.fromDays(15).minutes,
    );

    const oldClaims = await this.decodeToken(
      `Bearer ${jwt.sign(
        { claims: { userId: user.id, userEmail: user.email } },
        this.jwtSecret,
      )}`,
    ).catch(() => null);

    const activeRole =
      oldClaims?.activeRole ?? (await this.resolveActiveRole(user)); // fallback if not in token

    const authTokenDto = new AuthTokenDto();

    authTokenDto.accessToken = await this.generateJwtToken(user, activeRole);
    authTokenDto.refreshToken = newAuthSession.refreshToken;

    return authTokenDto;
  }

  public async revokeRefreshToken(refreshToken: string): Promise<void> {
    const authSession =
      await this.authSessionService.getSessionByRefreshToken(refreshToken);

    await this.authSessionService.revokeAuthSession(authSession);
  }

  public async generateJwtToken(
    user: User,
    activeRole: ActiveRoleEnum,
  ): Promise<string> {
    const claims = await this.generateJwtClaims(user, activeRole);

    return jwt.sign({ claims }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      algorithm: this.jwtAlgorithm,
    });
  }

  public hashPassword(password: string): string {
    const saltedPassword = this.passwordSalt + password;

    return Hash.from(saltedPassword).sha512();
  }

  public async generateJwtClaims(
    user: User,
    activeRole: ActiveRoleEnum,
  ): Promise<JwtClaimsDto> {
    const claims = new JwtClaimsDto();

    claims.userEmail = user.email;
    claims.userId = user.id;
    claims.activeRole = activeRole;

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
