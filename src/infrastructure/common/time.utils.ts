export class Time {
  readonly #seconds: number;

  constructor(seconds: number) {
    this.#seconds = seconds;
  }

  static fromSeconds(seconds: number): Time {
    return new Time(seconds);
  }

  static fromMinutes(minutes: number): Time {
    return new Time(minutes * 60);
  }

  static fromHours(hours: number): Time {
    return new Time(hours * 60 * 60);
  }

  static fromDays(days: number): Time {
    return new Time(days * 24 * 60 * 60);
  }

  get seconds(): number {
    return this.#seconds;
  }

  get minutes(): number {
    return this.#seconds / 60;
  }

  get hours(): number {
    return this.#seconds / 60 / 60;
  }

  get days(): number {
    return this.#seconds / 24 / 60 / 60;
  }

  get milliseconds(): number {
    return this.#seconds * 1000;
  }
}
