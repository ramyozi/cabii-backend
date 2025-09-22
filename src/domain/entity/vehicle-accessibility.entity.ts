import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { AccessibilityFeature } from './accessibility-feature.entity';
import { Vehicle } from './vehicle.entity';

@Entity()
@Unique(['vehicle', 'feature'])
export class VehicleAccessibility {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.accessibilityOptions, {
    onDelete: 'CASCADE',
  })
  vehicle: Vehicle;

  @ManyToOne(() => AccessibilityFeature)
  feature: AccessibilityFeature;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
