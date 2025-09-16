import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthSession } from './auth-session.entity';
import { RoleEnum } from '../enums/role.enum';

@Entity()
export class User {
  @ApiProperty()
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

  @ApiProperty()
  @Column('varchar', { length: 20, unique: true, nullable: false })
  phone: string;

  @Exclude()
  @Column('varchar', { length: 255, nullable: true })
  password?: string;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ type: () => Date })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  @ApiProperty({ enum: RoleEnum })
  @Column('enum', { enum: RoleEnum, default: RoleEnum.User })
  role: RoleEnum;

  @Exclude()
  @OneToMany(() => AuthSession, (authSession) => authSession.user, {
    eager: false,
  })
  authSessions: AuthSession[];
}
