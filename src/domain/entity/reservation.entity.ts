import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerProfile } from './customer-profile.entity';
import { DeliveryObject } from './delivery-object.entity';
import { DriverProfile } from './driver-profile.entity';
import { RidePassenger } from './ride-passenger.entity';
import { Vehicle } from './vehicle.entity';
import { ReservationStatusEnum } from '../enums/reservation-status.enum';
import { ReservationTypeEnum } from '../enums/reservation-type.enum';

@Entity()
export class Reservation {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerProfile, (customer) => customer.reservations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerProfile;

  @ManyToOne(() => DriverProfile, (driver) => driver.reservations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'driver_id' })
  driver?: DriverProfile;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.reservations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: Vehicle;

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

  @ApiProperty({ type: () => Date, required: false })
  @Column({ type: 'timestamptz', nullable: true })
  scheduledAt?: Date;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => DeliveryObject, (o) => o.reservation, { cascade: true })
  deliveryObjects?: DeliveryObject[];

  @OneToMany(() => RidePassenger, (p) => p.reservation, { cascade: true })
  passengers?: RidePassenger[];
}
