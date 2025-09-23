import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeliveryReceiverCreateRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ required: false })
  @IsString()
  email?: string;
}
