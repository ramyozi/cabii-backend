import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from '../../domain/entity/user.entity';
import { RoleEnum } from '../../domain/enums/role.enum';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { UserCreateRequestDto } from '../dto/user/user-create-request.dto';

@Injectable()
export class UserAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getList() {
    return await this.userRepository.getAll();
  }

  async getOneById(userId: string) {
    return await this.userRepository.getOneById(userId);
  }

  async getOneByLogin(login: string) {
    return await this.userRepository.getOneByLoginOrEmail(login);
  }
}
