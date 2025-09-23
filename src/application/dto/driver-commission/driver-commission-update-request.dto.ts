import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';

import { CommissionTypeEnum } from '../../../domain/enums/comission-type.enum';

export class DriverCommissionUpdateRequestDto {
  @ApiProperty({ enum: CommissionTypeEnum, required: false })
  @IsOptional()
  @IsEnum(CommissionTypeEnum)
  type?: CommissionTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  percentage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fixedFee?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
