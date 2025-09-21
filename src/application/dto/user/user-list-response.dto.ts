import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../../domain/entity/user.entity';
import { ListResponseDto } from '../list.response.dto';

export class UserListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [User] })
  declare data: User[];
}
