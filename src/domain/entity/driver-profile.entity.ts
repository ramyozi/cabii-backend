import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @ApiProperty()
  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver, {
    cascade: true,
    eager: true,
  })
  vehicles: Vehicle[];

  @ApiProperty()
  @OneToMany(() => DriverDocument, (document) => document.driver, {
    cascade: true,
    eager: true,
  })
  documents: DriverDocument[];

  @ApiProperty()
  @OneToMany(() => DriverCommission, (commission) => commission.driver, {
    cascade: true,
    eager: true,
  })
  commissions: DriverCommission[];

  @OneToOne(() => User, (user) => user.driverProfile, { onDelete: 'CASCADE' })
  user: User;
}
