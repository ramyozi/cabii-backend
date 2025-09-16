import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Driver } from './driver.entity';
import { VehicleAccessibility } from './vehicle-accessibility.entity';
import { VehicleCategory } from './vehicle-category.entity';

@Entity()
export class Vehicle {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(() => Driver, (driver) => driver.vehicles)
  driver: Driver;

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

  @ApiProperty()
  @OneToOne(() => VehicleCategory)
  category: VehicleCategory;

  @OneToMany(() => VehicleAccessibility, (va) => va.vehicle, { cascade: true })
  accessibilityOptions: VehicleAccessibility[];
}
