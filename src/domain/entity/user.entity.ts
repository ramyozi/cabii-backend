import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleEnum } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('varchar', { length: 255, nullable: false })
  firstname: string;

  @ApiProperty()
  @Column('varchar', { length: 255, nullable: false })
  lastname: string;

  @Column('varchar', { length: 255, unique: true })
  login: string;

  @ApiProperty()
  @Column('varchar', { length: 255, unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ type: () => Date })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  @ApiProperty({ type: () => RoleEnum })
  @Column('enum', { enum: RoleEnum, array: true, default: [RoleEnum.User] })
  role: RoleEnum;
}
