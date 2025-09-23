import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsBoolean } from 'class-validator';

export class RidePassengerCreateRequestDto {
  @ApiProperty()
  @IsUUID()
  reservationId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  age: number;

  @ApiProperty()
  @IsBoolean()
  hasReducedMobility: boolean;
}
