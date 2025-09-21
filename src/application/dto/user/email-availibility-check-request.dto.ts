import { IsEmail, IsString } from 'class-validator';

export class EmailAvailibilityCheckRequestDto {
  @IsEmail()
  @IsString()
  email: string;
}
