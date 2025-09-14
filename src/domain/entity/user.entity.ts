import { Entity } from 'typeorm';

@Entity()
export class User {
  id: string;
  login: string;
  password: string;
}
