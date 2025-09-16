import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * exemple: "Fauteuil roulant", "Chien guide"
 */

@Entity()
export class AccessibilityFeature {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  icon?: string;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
