import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DriverProfile } from './driver-profile.entity';
import { VehicleAccessibility } from './vehicle-accessibility.entity';
import { VehicleCategory } from './vehicle-category.entity';

@Entity()
export class Vehicle {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DriverProfile, (driver) => driver.vehicles)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverProfile;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  brand: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  model: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  plate: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  color: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  chassisNumber: string;

  @ManyToOne(() => VehicleCategory, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: VehicleCategory;

  @OneToMany(() => VehicleAccessibility, (va) => va.vehicle, { cascade: true })
  accessibilityOptions: VehicleAccessibility[];
}
