import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { DriverCommission } from './driver-commission.entity';
import { DriverDocument } from './driver-document.entity';
import { Reservation } from './reservation.entity';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class DriverProfile {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  driverLicenseSerial: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver, {
    cascade: true,
  })
  vehicles: Vehicle[];

  @ManyToOne(() => Vehicle, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'active_vehicle_id' })
  activeVehicle?: Vehicle;

  @OneToMany(() => Reservation, (res) => res.driver)
  reservations: Reservation[];

  @OneToMany(() => DriverDocument, (document) => document.driver, {
    cascade: true,
  })
  documents: DriverDocument[];

  @OneToMany(() => DriverCommission, (commission) => commission.driver, {
    cascade: true,
  })
  commissions: DriverCommission[];

  @OneToOne(() => User, (user) => user.driverProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Unique(['user'])
  user: User;

  // for tracking purposes
  @ApiProperty()
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAvg: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  totalRatings: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  currentLat?: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  currentLng?: number;

  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  lastSeenAt?: Date;
}
