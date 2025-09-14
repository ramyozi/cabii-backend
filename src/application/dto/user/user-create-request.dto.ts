import { RoleEnum } from '../../../domain/enums/role.enum';

export class UserCreateRequestDto {
  login: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: RoleEnum;
}
