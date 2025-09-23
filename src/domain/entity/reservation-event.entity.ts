import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Reservation } from './reservation.entity';
import { ReservationEventTypeEnum } from '../enums/reservation-event-type.enum';

@Entity()
export class ReservationEvent {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Reservation, (res) => res.events, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ApiProperty({ enum: ReservationEventTypeEnum })
  @Column({ type: 'enum', enum: ReservationEventTypeEnum })
  type: ReservationEventTypeEnum;

  /**
   * Arbitrary metadata (e.g., passengerId, objectId, etaSeconds, distanceMeters, coords, notes)
   */
  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
