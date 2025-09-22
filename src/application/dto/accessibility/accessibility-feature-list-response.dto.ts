import { ApiProperty } from '@nestjs/swagger';

import { AccessibilityFeature } from '../../../domain/entity/accessibility-feature.entity';
import { ListResponseDto } from '../list.response.dto';

export class AccessibilityFeatureListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [AccessibilityFeature] })
  declare data: AccessibilityFeature[];
}
