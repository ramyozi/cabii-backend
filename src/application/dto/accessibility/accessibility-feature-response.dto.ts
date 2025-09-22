import { ApiProperty } from '@nestjs/swagger';

import { AccessibilityFeature } from '../../../domain/entity/accessibility-feature.entity';
import { BaseResponseDto } from '../base.response.dto';

export class AccessibilityFeatureResponseDto extends BaseResponseDto {
  @ApiProperty({ type: AccessibilityFeature })
  declare data: AccessibilityFeature;
}
