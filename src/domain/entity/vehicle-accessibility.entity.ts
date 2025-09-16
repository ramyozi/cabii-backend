import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

import { AccessibilityFeature } from './accessibility-feature.entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class VehicleAccessibility {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.accessibilityOptions, {
    onDelete: 'CASCADE',
  })
  vehicle: Vehicle;

  @ManyToOne(() => AccessibilityFeature, { eager: true })
  feature: AccessibilityFeature;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
