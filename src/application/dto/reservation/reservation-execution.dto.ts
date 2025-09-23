import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class PassengerOnBoardDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  passengerId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class PackageActionDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  objectId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class EtaUpdateDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  etaSeconds: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  distanceMeters: number;
}
