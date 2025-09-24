import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { ActiveRoleEnum } from '../../../domain/enums/active-role.enum';

export class SwitchRoleDto {
  @ApiProperty({ enum: ActiveRoleEnum })
  @IsEnum(ActiveRoleEnum)
  activeRole: ActiveRoleEnum;
}
