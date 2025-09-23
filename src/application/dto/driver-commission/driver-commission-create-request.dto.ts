import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { CommissionTypeEnum } from '../../../domain/enums/comission-type.enum';

export class DriverCommissionCreateRequestDto {
  @ApiProperty({ enum: CommissionTypeEnum })
  @IsEnum(CommissionTypeEnum)
  type: CommissionTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  percentage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fixedFee?: number;
}
