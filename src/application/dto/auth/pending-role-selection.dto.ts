import { ApiProperty } from '@nestjs/swagger';

export class PendingRoleSelectionDto {
  @ApiProperty({ example: true })
  pendingRoleSelection: true;

  @ApiProperty({
    description: 'Short-lived access token to authenticate /auth/switch-role',
  })
  tempToken: string;
}
