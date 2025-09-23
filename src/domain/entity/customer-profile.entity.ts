import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Reservation } from './reservation.entity';
import { User } from './user.entity';

@Entity()
export class CustomerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.customerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Unique(['user'])
  user: User;

  @OneToMany(() => Reservation, (res) => res.customer)
  reservations: Reservation[];
}
