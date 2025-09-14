import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AuthSession } from '../../domain/entity/auth-session.entity';

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
      throw new NotFoundException(
        `AuthSession with refreshToken ${refreshToken} not found`,
      );
    }

    return authSession;
  }
}
