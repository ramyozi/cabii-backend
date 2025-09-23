import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { DriverProfile } from './driver-profile.entity';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { ReservationStatusEnum } from '../enums/reservation-status.enum';
import { ReservationTypeEnum } from '../enums/reservation-type.enum';

@Entity()
@Index(['user', 'status'])
@Index(['driver', 'status'])
export class Reservation {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => DriverProfile, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver?: DriverProfile | null;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: Vehicle | null;

  @ApiProperty({ enum: ReservationTypeEnum })
  @Column({ type: 'enum', enum: ReservationTypeEnum })
  type: ReservationTypeEnum;

  @ApiProperty({ enum: ReservationStatusEnum })
  @Column({
    type: 'enum',
    enum: ReservationStatusEnum,
    default: ReservationStatusEnum.Pending,
  })
  status: ReservationStatusEnum;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  pickupLat: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  pickupLng: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  dropoffLat: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  dropoffLng: number;

  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  scheduledAt?: Date | null;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceEstimate?: number | null;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalPrice?: number | null;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
