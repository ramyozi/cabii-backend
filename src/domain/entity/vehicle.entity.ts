import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { DriverProfile } from './driver-profile.entity';
import { Reservation } from './reservation.entity';
import { VehicleAccessibility } from './vehicle-accessibility.entity';
import { VehicleCategory } from './vehicle-category.entity';
import { VehicleStatusEnum } from '../enums/vehicle-status.enum';

@Entity()
@Unique(['plate'])
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

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  year?: number;

  @ApiProperty({ enum: VehicleStatusEnum })
  @Column({
    type: 'enum',
    enum: VehicleStatusEnum,
    default: VehicleStatusEnum.UNDER_REVIEW,
  })
  status: VehicleStatusEnum;

  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  insuranceExpiryDate?: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: true })
  insuranceFileUrl?: string;

  @ManyToOne(() => VehicleCategory, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: VehicleCategory;

  @OneToMany(() => VehicleAccessibility, (va) => va.vehicle, { cascade: true })
  accessibilityOptions: VehicleAccessibility[];

  @OneToMany(() => Reservation, (res) => res.vehicle)
  reservations: Reservation[];
}
