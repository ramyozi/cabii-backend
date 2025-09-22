import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { AccessibilityFeature } from './accessibility-feature.entity';
import { User } from './user.entity';

@Entity()
@Unique(['user', 'feature'])
export class UserAccessibility {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.accessibilityPreferences, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => AccessibilityFeature)
  feature: AccessibilityFeature;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
