import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../base.response.dto';

export class AccessibilityMatchResponseDto extends BaseResponseDto {
  @ApiProperty()
  declare data: {
    isCompatible: boolean;
    missingFeatures: string[];
  };
}
