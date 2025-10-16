import { ApiProperty } from '@nestjs/swagger';

import { AuthTokenDto } from './auth-token.dto';
import { BaseResponseDto } from '../base.response.dto';

export class AuthTokenResponseDto extends BaseResponseDto {
  @ApiProperty({ type: AuthTokenDto })
  declare data: AuthTokenDto;
}
