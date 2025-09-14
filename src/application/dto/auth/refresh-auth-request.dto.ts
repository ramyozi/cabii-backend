import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefreshAuthRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  refreshToken?: string;
}
