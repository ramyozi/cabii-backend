import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  data?: unknown;
}
