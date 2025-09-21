import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from './base.response.dto';

export class ListResponseDto extends BaseResponseDto {
  @ApiProperty()
  data: unknown[];

  @ApiProperty()
  totalItems: number;
}
