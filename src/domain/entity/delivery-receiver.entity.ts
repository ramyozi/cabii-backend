import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DeliveryObject } from './delivery-object.entity';

@Entity()
export class DeliveryReceiver {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string;

  @OneToMany(() => DeliveryObject, (obj) => obj.receiver)
  objects: DeliveryObject[];

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
