import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DriverProfile } from './driver-profile.entity';

@Entity()
export class DriverLocation {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DriverProfile, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverProfile;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lat: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lng: number;

  @ApiProperty({ required: false })
  @Column({ type: 'int', nullable: true })
  headingDeg?: number;

  @ApiProperty({ required: false })
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  speedKph?: number;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
