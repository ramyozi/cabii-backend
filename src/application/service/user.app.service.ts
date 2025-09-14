import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../infrastructure/repository/user.repository';

@Injectable()
export class UserAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async getList() {
    return await this.userRepository.getAll();
  }

  async getOneById(userId: string) {
    return await this.userRepository.getOneById(userId);
  }
}
