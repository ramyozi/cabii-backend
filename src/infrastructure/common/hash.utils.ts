import { createHash } from 'crypto';

export class Hash {
  constructor(private readonly value: string) {}

  static from(value: string): Hash {
    return new Hash(value);
  }

  public sha512(): string {
    const hash = createHash('sha512');

    hash.update(this.value);
    return hash.digest('hex');
  }
}
