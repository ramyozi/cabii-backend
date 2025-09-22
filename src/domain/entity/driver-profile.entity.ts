import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { DriverCommission } from './driver-commission.entity';
import { DriverDocument } from './driver-document.entity';
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
}
