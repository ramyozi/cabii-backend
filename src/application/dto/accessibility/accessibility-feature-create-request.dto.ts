import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { AccessibilityCategoryEnum } from '../../../domain/enums/accessibility-category.enum';

export class AccessibilityFeatureCreateRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ enum: AccessibilityCategoryEnum })
  @IsEnum(AccessibilityCategoryEnum)
  category: AccessibilityCategoryEnum;
}
