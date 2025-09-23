import { Injectable } from '@nestjs/common';

import { Reservation } from '../../domain/entity/reservation.entity';
import { ReservationEventTypeEnum } from '../../domain/enums/reservation-event-type.enum';
import { ReservationStatusEnum } from '../../domain/enums/reservation-status.enum';
import { ReservationTypeEnum } from '../../domain/enums/reservation-type.enum';
import { ReservationBadStateException } from '../../domain/exception/reservation/reservation-bad-state.exception';
import { ReservationEventTypeNotAllowedException } from '../../domain/exception/reservation/reservation-event-type-not-allowed.exception';
import { ReservationService } from '../../domain/service/reservation.service';
import { ReservationEventRepository } from '../../infrastructure/repository/reservation-event.repository';
import { ReservationRepository } from '../../infrastructure/repository/reservation.repository';

@Injectable()
export class ReservationExecutionAppService {
  constructor(
    private readonly reservationRepo: ReservationRepository,
    private readonly eventRepo: ReservationEventRepository,
    private readonly reservationService: ReservationService,
  ) {}

  private async createEvent(
    reservation: Reservation,
    type: ReservationEventTypeEnum,
    payload?: Record<string, any>,
  ) {
    return await this.eventRepo.save(
      this.eventRepo.create({ reservation, type, payload }),
    );
  }

  async driverArrived(id: string): Promise<Reservation> {
    const res = await this.reservationRepo.getOneById(id);

    // allowed only if Accepted
    if (res.status !== ReservationStatusEnum.Accepted) {
      throw new ReservationBadStateException(
        `Driver arrival not allowed from ${res.status}`,
      );
    }

    await this.createEvent(res, ReservationEventTypeEnum.DriverArrived);
    return res;
  }

  async passengerOnBoard(
    id: string,
    payload?: { passengerId?: string; note?: string },
  ): Promise<Reservation> {
    const res = await this.reservationRepo.getOneById(id);

    if (res.type !== ReservationTypeEnum.Ride) {
      throw new ReservationEventTypeNotAllowedException(
        'Passengers only allowed for ride reservations',
      );
    }

    // Allowed from Accepted or InProgress
    if (
      ![
        ReservationStatusEnum.Accepted,
        ReservationStatusEnum.InProgress,
      ].includes(res.status)
    ) {
      throw new ReservationBadStateException(
        `Passenger onboarding not allowed from ${res.status}`,
      );
    }

    await this.createEvent(
      res,
      ReservationEventTypeEnum.PassengerOnBoard,
      payload,
    );
    return res;
  }

  async startTrip(id: string): Promise<Reservation> {
    const res = await this.reservationRepo.getOneById(id);

    this.reservationService.validateStatusTransition(
      res.status,
      ReservationStatusEnum.InProgress,
    );

    res.status = ReservationStatusEnum.InProgress;
    await this.reservationRepo.save(res);
    await this.createEvent(res, ReservationEventTypeEnum.TripStarted);
    return res;
  }

  async completeTrip(id: string): Promise<Reservation> {
    const res = await this.reservationRepo.getOneById(id);

    this.reservationService.validateStatusTransition(
      res.status,
      ReservationStatusEnum.Completed,
    );

    res.status = ReservationStatusEnum.Completed;
    await this.reservationRepo.save(res);
    await this.createEvent(res, ReservationEventTypeEnum.TripCompleted);
    return res;
  }

  async packagePickedUp(
    id: string,
    payload?: { objectId?: string; note?: string },
  ): Promise<Reservation> {
    const res = await this.reservationRepo.getOneById(id);

    if (res.type !== ReservationTypeEnum.Delivery) {
      throw new ReservationEventTypeNotAllowedException(
        'Package pickup only allowed for delivery reservations',
      );
    }

    // Allowed from Accepted or InProgress
    if (
      ![
        ReservationStatusEnum.Accepted,
        ReservationStatusEnum.InProgress,
      ].includes(res.status)
    ) {
      throw new ReservationBadStateException(
        `Package pickup not allowed from ${res.status}`,
      );
    }

    await this.createEvent(
      res,
      ReservationEventTypeEnum.PackagePickedUp,
      payload,
    );
    return res;
  }

  async packageDelivered(
    id: string,
    payload?: { objectId?: string; note?: string },
  ): Promise<Reservation> {
    const res = await this.reservationRepo.getOneById(id);

    if (res.type !== ReservationTypeEnum.Delivery) {
      throw new ReservationEventTypeNotAllowedException(
        'Package delivered only allowed for delivery reservations',
      );
    }

    // Allowed from InProgress
    if (res.status !== ReservationStatusEnum.InProgress) {
      throw new ReservationBadStateException(
        `Package delivered not allowed from ${res.status}`,
      );
    }

    await this.createEvent(
      res,
      ReservationEventTypeEnum.PackageDelivered,
      payload,
    );
    return res;
  }

  async etaUpdated(
    id: string,
    payload: { etaSeconds: number; distanceMeters: number },
  ): Promise<Reservation> {
    const res = await this.reservationRepo.getOneById(id);

    await this.createEvent(res, ReservationEventTypeEnum.EtaUpdated, payload);
    return res;
  }

  async getEvents(id: string) {
    await this.reservationRepo.getOneById(id); // existence check
    return await this.eventRepo.getAllByReservationId(id);
  }
}
