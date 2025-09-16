import { Injectable, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import * as nanoid from 'nanoid';

import { AuthSession } from '../../domain/entity/auth-session.entity';
import { User } from '../../domain/entity/user.entity';
import { AuthSessionRepository } from '../../infrastructure/repository/auth-session.repository';

/**
 * We don't call this service with app because this service is only used by AuthController, it's not a business service
 */
@Injectable()
export class AuthSessionService {
  constructor(private readonly authSessionRepository: AuthSessionRepository) {}

  async getSessionByRefreshToken(refreshToken: string): Promise<AuthSession> {
    const authSession =
      await this.authSessionRepository.getOneByRefreshToken(refreshToken);

    if (authSession.isRevoked) {
      throw new NotFoundException(
        `AuthSession with refreshToken ${refreshToken} is revoked`,
      );
    }

    if (this.isSessionExpired(authSession)) {
      throw new NotFoundException(
        `AuthSession with refreshToken ${refreshToken} is expired`,
      );
    }

    return authSession;
  }

  async createAuthSession(
    user: User,
    minutesDuration: number,
  ): Promise<AuthSession> {
    const authSession = new AuthSession();

    authSession.user = user;
    authSession.expiresAt = this.generateExpirationDate(minutesDuration);
    authSession.refreshToken = this.generateRefreshToken(authSession.expiresAt);
    authSession.createdAt = new Date();

    return await this.authSessionRepository.save(authSession);
  }

  async refreshAuthSession(
    authSession: AuthSession,
    minutesDuration: number,
  ): Promise<AuthSession> {
    authSession.expiresAt = this.generateExpirationDate(minutesDuration);
    authSession.refreshToken = this.generateRefreshToken(authSession.expiresAt);

    return await this.authSessionRepository.save(authSession);
  }

  async revokeAuthSession(authSession: AuthSession): Promise<AuthSession> {
    authSession.isRevoked = true;
    return await this.authSessionRepository.save(authSession);
  }

  private isSessionExpired(authSession: AuthSession): boolean {
    return authSession.expiresAt < new Date();
  }

  private generateRefreshToken(expiresAt: Date, length = 64): string {
    const baseToken = nanoid.nanoid(length);

    const unixEpoch = Math.round(expiresAt.getTime() / 1000);
    const encapsuledExpireAt = btoa(JSON.stringify({ exp: unixEpoch }));

    return `${baseToken}.${encapsuledExpireAt}`;
  }

  private generateExpirationDate(minutesDuration: number): Date {
    const dateNow = DateTime.now();
    const dateNowPlusDuration = dateNow.plus({ minutes: minutesDuration });

    return dateNowPlusDuration.toJSDate();
  }
}
