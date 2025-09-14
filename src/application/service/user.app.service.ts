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

  async create(dto: UserCreateRequestDto): Promise<User> {
    const user = new User();

    user.login = dto.login;
    user.role = dto.role || RoleEnum.User;
    user.firstname = dto.firstname;
    user.lastname = dto.lastname;
    user.email = dto.email;
    user.password = this.authService.hashPassword(dto.password);

    return await this.userRepository.save(user);
  }
}
