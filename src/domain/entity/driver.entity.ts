import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Driver extends User {
  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  driverLicenseSerial: string;
}
