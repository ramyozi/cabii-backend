import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Driver } from './driver.entity';
import { CommissionTypeEnum } from '../enums/comission-type.enum';

@Entity()
export class DriverCommission {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Driver, (driver) => driver.commissions, {
    onDelete: 'CASCADE',
  })
  driver: Driver;

  @ApiProperty({ enum: CommissionTypeEnum })
  @Column({ type: 'enum', enum: CommissionTypeEnum })
  type: CommissionTypeEnum;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage?: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixedFee?: number;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
