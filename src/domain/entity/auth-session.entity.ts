import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 512 })
  refreshToken: string;

  @Column('timestamp')
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.authSessions)
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('boolean', { default: false })
  isRevoked: boolean;
}
