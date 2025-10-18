import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { ActiveRoleEnum } from '../../../domain/enums/active-role.enum';

export class SignInRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsEnum(ActiveRoleEnum)
  @ApiProperty({ enum: ActiveRoleEnum, required: false })
  activeRole?: ActiveRoleEnum;
}
