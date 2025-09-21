export interface ListInterface<T> {
  data: T[];
  totalItems: number;
}

export class ListBuilder<T> {
  constructor(
    private data: T[],
    private totalItems?: number,
  ) {}

  build(): ListInterface<T> {
    return {
      data: this.data,
      totalItems: this.totalItems ?? this.data.length,
    };
  }
}
