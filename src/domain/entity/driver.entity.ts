import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { DriverCommission } from './driver-commission.entity';
import { DriverDocument } from './driver-document.entity';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Driver extends User {
  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  driverLicenseSerial: string;

  @ApiProperty()
  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver)
  vehicles: Vehicle[];

  @ApiProperty()
  @OneToMany(() => DriverDocument, (document) => document.driver, {
    cascade: true,
  })
  documents: DriverDocument[];

  @OneToMany(() => DriverCommission, (commission) => commission.driver)
  commissions: DriverCommission[];
}
