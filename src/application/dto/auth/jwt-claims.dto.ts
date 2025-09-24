import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ActiveRoleEnum } from '../../../domain/enums/active-role.enum';

export class JwtClaimsDto {
  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ActiveRoleEnum })
  @IsEnum(ActiveRoleEnum)
  activeRole: ActiveRoleEnum;
}
