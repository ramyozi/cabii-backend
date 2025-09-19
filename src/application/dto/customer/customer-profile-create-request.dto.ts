import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CustomerProfileCreateRequestDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
