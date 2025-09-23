import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class ReservationRescheduleDto {
  @ApiProperty({ description: 'New scheduled date' })
  @IsDateString()
  newScheduledAt: Date;
}
