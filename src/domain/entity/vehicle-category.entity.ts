import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VehicleCategory {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  icon: string;

  @ApiProperty()
  @Column({ type: 'int' })
  maxPassengers: number;

  @ApiProperty()
  @Column({ type: 'decimal' })
  costPerKm: number;
}
