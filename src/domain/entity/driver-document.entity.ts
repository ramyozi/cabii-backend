import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DriverProfile } from './driver-profile.entity';
import { DriverDocumentStatusEnum } from '../enums/driver-document-status.enum';
import { DriverDocumentTypeEnum } from '../enums/driver-document-type.enum';

@Entity()
export class DriverDocument {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: DriverDocumentTypeEnum })
  @Column({ type: 'enum', enum: DriverDocumentTypeEnum })
  type: DriverDocumentTypeEnum;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  @ApiProperty({ enum: DriverDocumentStatusEnum })
  @Column({
    type: 'enum',
    enum: DriverDocumentStatusEnum,
    default: DriverDocumentStatusEnum.PENDING,
  })
  status: DriverDocumentStatusEnum;

  @ApiProperty()
  @Column({ type: 'timestamptz', nullable: true })
  expiryDate?: Date;

  @ApiProperty({ type: () => DriverProfile })
  @ManyToOne(() => DriverProfile, (driver) => driver.documents, {
    onDelete: 'CASCADE',
  })
  driver: DriverProfile;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
