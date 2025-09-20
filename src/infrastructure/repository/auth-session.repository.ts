import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AuthSession } from '../../domain/entity/auth-session.entity';
import { AuthSessionNotFoundException } from '../../domain/exception/auth/auth-session-not-found.exception';

@Injectable()
export class AuthSessionRepository extends Repository<AuthSession> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(AuthSession, entityManager || dataSource!.createEntityManager());
  }

  async getOneByRefreshToken(refreshToken: string): Promise<AuthSession> {
    const authSession = await this.createQueryBuilder('authSession')
      .leftJoinAndSelect('authSession.user', 'user')
      .where('authSession.refreshToken = :refreshToken', { refreshToken })
      .getOne();

    if (!authSession) {
      throw new AuthSessionNotFoundException(
        `AuthSession with refreshToken ${refreshToken} not found`,
      );
    }

    return authSession;
  }
}
