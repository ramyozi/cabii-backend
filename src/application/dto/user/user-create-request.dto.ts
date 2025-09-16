import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { RoleEnum } from '../../../domain/enums/role.enum';

export class UserCreateRequestDto {
  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'If not provided, the default role will be User',
    required: false,
    enum: RoleEnum,
  })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}
