import { IsNotEmpty, IsString } from 'class-validator';

export class JwtClaimsDto {
  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
