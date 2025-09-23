import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ReservationAssignDriverDto {
  @ApiProperty()
  @IsUUID()
  driverId: string;
}
