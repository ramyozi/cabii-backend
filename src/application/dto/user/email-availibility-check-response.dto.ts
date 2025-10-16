import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../base.response.dto';

export class EmailAvailabilityCheckResponseDto extends BaseResponseDto {
  @ApiProperty({ example: { isAvailable: true } })
  declare data: { isAvailable: boolean };
}
