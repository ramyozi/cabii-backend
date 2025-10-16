import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from '../../domain/entity/user.entity';
import { ActiveRoleEnum } from '../../domain/enums/active-role.enum';
import { RoleEnum } from '../../domain/enums/role.enum';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { UserCreateRequestDto } from '../dto/user/user-create-request.dto';

@Injectable()
export class UserAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getList(): Promise<ListInterface<User>> {
    const [users, usersCount] = await this.userRepository.getAll();

    const list = new ListBuilder(users, usersCount);

    return list.build();
  }

  async getOneById(userId: string) {
    return await this.userRepository.getOneById(userId);
  }

  async getOneByEmail(email: string) {
    return await this.userRepository.getOneByEmail(email);
  }

  async create(dto: UserCreateRequestDto): Promise<User> {
    const user = new User();

    user.role = dto.role || RoleEnum.User;
    user.firstname = dto.firstname;
    user.lastname = dto.lastname;
    user.activeRole = ActiveRoleEnum.Onboarding;

    await this.isEmailAvailable(dto.email);
    user.email = dto.email;

    await this.isPhoneNumberAvailable(dto.phone);

    user.phone = dto.phone;
    user.password = this.authService.hashPassword(dto.password);

    return await this.userRepository.save(user);
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    return this.userRepository.isEmailAvailable(email);
  }

  async isPhoneNumberAvailable(phone: string): Promise<boolean> {
    return await this.userRepository.isPhoneNumberAvailable(phone);
  }
}
