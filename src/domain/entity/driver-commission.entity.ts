import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DriverProfile } from './driver-profile.entity';
import { CommissionTypeEnum } from '../enums/comission-type.enum';

/**
 * Entité DriverCommission
 *
 * Cette entité permet de définir la règle de commission appliquée
 * sur chaque course ou livraison effectuée par un chauffeur.
 *
 * Pourquoi ?
 * - Cabii doit prélever une part (commission) sur le prix payé par le client.
 * - Le reste correspond aux gains nets du chauffeur.
 * - Les règles de commission peuvent varier selon les chauffeurs, les périodes,
 * ou les promotions.
 *
 * Types de commission possibles (restent a définir):
 * 1. PERCENTAGE → un pourcentage du prix total (20% ?).
 * 2. FIXED → un montant fixe prélevé à chaque course (2.50 €?).
 * 3. MIXED → combinaison des deux (15% + 1,5 € ?).
 *
 * Exemple :
 * Prix de la course : 20 €
 * Commission (20%) : 4 €
 * → Chauffeur reçoit : 16 €
 *
 * Exemple MIXED :
 * Prix de la course : 20 €
 * Commission (10% + 1,5 € fixe) : 3,5 €
 * → Chauffeur reçoit : 16,5 €
 *
 * Notes importantes :
 * - Une commission peut être activée/désactivée (champ "active").
 * - On peut garder un historique des commissions appliquées
 *   en ne supprimant jamais mais en désactivant l'ancienne.
 * - Le calcul des gains se fait toujours après avoir déterminé
 *   le prix final de la course (baseFare + distance * costPerKm).
 */

@Entity()
export class DriverCommission {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DriverProfile, (driver) => driver.commissions, {
    onDelete: 'CASCADE',
  })
  driver: DriverProfile;

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
