import { IsPhoneNumber } from 'class-validator';

export class PhoneAvailibilityCheckRequestDto {
  @IsPhoneNumber(undefined) // undefined c'est pour valider les numéros de téléphone internationaux
  phone: string;
}
