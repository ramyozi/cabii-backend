import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;
}
