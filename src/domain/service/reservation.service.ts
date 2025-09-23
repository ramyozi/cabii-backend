import { Injectable } from '@nestjs/common';

import { ReservationStatusEnum } from '../enums/reservation-status.enum';
import { ReservationInvalidStatusTransitionException } from '../exception/reservation/reservation-invalid-status-transition.exception';

@Injectable()
export class ReservationService {
  constructor() {}

  public validateStatusTransition(
    current: ReservationStatusEnum,
    next: ReservationStatusEnum,
  ) {
    const allowedTransitions: Record<
      ReservationStatusEnum,
      ReservationStatusEnum[]
    > = {
      [ReservationStatusEnum.Pending]: [
        ReservationStatusEnum.Accepted,
        ReservationStatusEnum.Cancelled,
      ],
      [ReservationStatusEnum.Accepted]: [
        ReservationStatusEnum.InProgress,
        ReservationStatusEnum.Cancelled,
      ],
      [ReservationStatusEnum.InProgress]: [ReservationStatusEnum.Completed],
      [ReservationStatusEnum.Completed]: [],
      [ReservationStatusEnum.Cancelled]: [],
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new ReservationInvalidStatusTransitionException(current, next);
    }
  }
}
