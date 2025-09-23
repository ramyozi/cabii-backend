import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SetActiveVehicleRequestDto {
  @ApiProperty({ description: 'The ID of the vehicle to set as active' })
  @IsUUID()
  vehicleId: string;
}
