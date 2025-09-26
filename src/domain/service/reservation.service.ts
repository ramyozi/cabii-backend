import * as process from 'node:process';

import { Injectable } from '@nestjs/common';
import haversine from 'haversine-distance';

import { DriverCommission } from '../entity/driver-commission.entity';
import { Reservation } from '../entity/reservation.entity';
import { CommissionTypeEnum } from '../enums/comission-type.enum';
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

  public calculateFare(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
    commission?: DriverCommission,
  ): { estimatedFare: number; companyFee: number; driverEarnings: number } {
    const baseFare = Number(process.env.BASE_FARE);
    const costPerKm = Number(process.env.COST_PER_KM);

    const distanceMeters = haversine(
      { lat: pickupLat, lon: pickupLng },
      { lat: dropoffLat, lon: dropoffLng },
    );
    const estimatedFare = baseFare + (distanceMeters / 1000) * costPerKm;

    if (!commission) {
      return { estimatedFare, companyFee: 0, driverEarnings: 0 };
    }

    const percentage = Number(commission.percentage) || 0;
    const fixedFee = Number(commission.fixedFee) || 0;

    let companyFee = 0;

    if (commission.type === CommissionTypeEnum.PERCENTAGE) {
      companyFee = (estimatedFare * percentage) / 100;
    } else if (commission.type === CommissionTypeEnum.FIXED) {
      companyFee = fixedFee;
    } else if (commission.type === CommissionTypeEnum.MIXED) {
      companyFee = (estimatedFare * percentage) / 100 + fixedFee;
    }

    const driverEarnings = estimatedFare - companyFee;

    return { estimatedFare, companyFee, driverEarnings };
  }

  public applyFare(
    reservation: Reservation,
    commission?: DriverCommission,
    lockFinal = false,
  ): Reservation {
    const fare = this.calculateFare(
      reservation.pickupLat,
      reservation.pickupLng,
      reservation.dropoffLat,
      reservation.dropoffLng,
      commission,
    );

    reservation.estimatedFare = Number(fare.estimatedFare.toFixed(2));
    reservation.companyFee = Number(fare.companyFee.toFixed(2));
    reservation.driverEarnings = Number(fare.driverEarnings.toFixed(2));

    if (lockFinal) {
      reservation.finalFare = reservation.estimatedFare;
    }

    return reservation;
  }

  // Temporary until i get a google maps API key
  public async calculateRoute(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
  ): Promise<{ distanceMeters: number; durationSeconds: number }> {
    const distanceMeters = haversine(
      { lat: pickupLat, lon: pickupLng },
      { lat: dropoffLat, lon: dropoffLng },
    );

    const avgSpeedMps = 50_000 / 3600; // 50 km/h
    const durationSeconds = distanceMeters / avgSpeedMps;

    return { distanceMeters, durationSeconds };
  }

  public async applyRoute(reservation: Reservation): Promise<Reservation> {
    const route = await this.calculateRoute(
      reservation.pickupLat,
      reservation.pickupLng,
      reservation.dropoffLat,
      reservation.dropoffLng,
    );

    reservation.estimatedDistanceMeters = Math.round(route.distanceMeters);
    reservation.estimatedDurationSeconds = Math.round(route.durationSeconds);

    return reservation;
  }

  /**
   * Finalize actual trip data (used in markCompleted).
   * In future: replace with real GPS tracking values.
   */
  public applyActuals(reservation: Reservation): Reservation {
    reservation.actualDistanceMeters = reservation.estimatedDistanceMeters;
    reservation.actualDurationSeconds = reservation.estimatedDurationSeconds;
    return reservation;
  }
}
