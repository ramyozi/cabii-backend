import { Injectable } from '@nestjs/common';
import haversine from 'haversine-distance';

import { AccessibilityMatchingAppService } from './accessibility-matching.app.service';
import { Reservation } from '../../domain/entity/reservation.entity';
import { ReservationStatusEnum } from '../../domain/enums/reservation-status.enum';
import { ReservationAccessibilityMismatchException } from '../../domain/exception/accessibility/reservation-accessibility-mismatch.exception';
import { ReservationAlreadyCompletedException } from '../../domain/exception/reservation/reservation-already-completed.exception';
import { ReservationCannotCancelException } from '../../domain/exception/reservation/reservation-cannot-cancel.exception';
import { ReservationDriverVehicleMismatchException } from '../../domain/exception/reservation/reservation-driver-vehicle-mismatch.exception';
import { ReservationService } from '../../domain/service/reservation.service';
import { CustomerProfileRepository } from '../../infrastructure/repository/customer-profile.repository';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { ReservationRepository } from '../../infrastructure/repository/reservation.repository';
import { UserAccessibilityRepository } from '../../infrastructure/repository/user-accessibility.repository';
import { VehicleAccessibilityRepository } from '../../infrastructure/repository/vehicle-accessibility.repository';
import { VehicleRepository } from '../../infrastructure/repository/vehicle.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { ReservationCreateRequestDto } from '../dto/reservation/reservation-create-request.dto';
import { ReservationUpdateRequestDto } from '../dto/reservation/reservation-update-request.dto';

@Injectable()
export class ReservationAppService {
  constructor(
    private readonly reservationRepo: ReservationRepository,
    private readonly customerRepo: CustomerProfileRepository,
    private readonly driverRepo: DriverProfileRepository,
    private readonly userAccessibilityRepository: UserAccessibilityRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly vehicleAccessibilityRepository: VehicleAccessibilityRepository,
    private readonly reservationService: ReservationService,
    private readonly accessibilityMatchingService: AccessibilityMatchingAppService,
  ) {}

  async create(dto: ReservationCreateRequestDto): Promise<Reservation> {
    const customer = await this.customerRepo.getOneById(dto.customerId);
    const driver = dto.driverId
      ? await this.driverRepo.getOneById(dto.driverId)
      : undefined;

    const vehicle = dto.vehicleId
      ? await this.vehicleRepository.getOneById(dto.vehicleId)
      : undefined;

    if (driver && vehicle && vehicle.driver.id !== driver.id) {
      throw new ReservationDriverVehicleMismatchException();
    }

    // Ensure accessibility requirements are met
    await this.ensureAccessibilityCompatible(customer.user.id, vehicle?.id);

    const reservation = new Reservation();

    reservation.customer = customer;
    reservation.vehicle = vehicle;
    reservation.driver = driver;
    reservation.type = dto.type;
    reservation.pickupLat = dto.pickupLat;
    reservation.pickupLng = dto.pickupLng;
    reservation.dropoffLat = dto.dropoffLat;
    reservation.dropoffLng = dto.dropoffLng;
    reservation.scheduledAt = dto.scheduledAt;

    return await this.reservationRepo.save(reservation);
  }

  async update(
    id: string,
    dto: ReservationUpdateRequestDto,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepo.getOneById(id);

    if (reservation.status === ReservationStatusEnum.Completed) {
      throw new ReservationAlreadyCompletedException();
    }

    if (dto.status && dto.status !== reservation.status) {
      this.reservationService.validateStatusTransition(
        reservation.status,
        dto.status,
      );
      reservation.status = dto.status;
    }

    let updatedVehicle = reservation.vehicle; // keep track of final vehicle

    if (dto.driverId) {
      const driver = await this.driverRepo.getOneById(dto.driverId);

      if (dto.vehicleId) {
        const vehicle = await this.vehicleRepository.getOneById(dto.vehicleId);

        if (reservation.driver && vehicle.driver.id !== reservation.driver.id) {
          throw new ReservationDriverVehicleMismatchException();
        }

        updatedVehicle = vehicle;
        reservation.vehicle = vehicle;
      }

      reservation.driver = driver;
    } else if (dto.vehicleId) {
      throw new ReservationDriverVehicleMismatchException();
    }

    reservation.scheduledAt = dto.scheduledAt ?? reservation.scheduledAt;

    // Only check accessibility if we actually have a vehicle
    await this.ensureAccessibilityCompatible(
      reservation.customer.user.id,
      updatedVehicle?.id,
    );

    return await this.reservationRepo.save(reservation);
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepo.getOneById(id);

    if (
      ![ReservationStatusEnum.Pending, ReservationStatusEnum.Accepted].includes(
        reservation.status,
      )
    ) {
      throw new ReservationCannotCancelException(reservation.status);
    }

    reservation.status = ReservationStatusEnum.Cancelled;
    return await this.reservationRepo.save(reservation);
  }

  async getById(id: string): Promise<Reservation> {
    return await this.reservationRepo.getOneById(id);
  }

  async getList(): Promise<ListInterface<Reservation>> {
    const [reservations, count] = await this.reservationRepo.getAll();

    return new ListBuilder(reservations, count).build();
  }

  async getListByCustomer(
    customerId: string,
  ): Promise<ListInterface<Reservation>> {
    const [reservations, count] =
      await this.reservationRepo.getAllByCustomer(customerId);

    return new ListBuilder(reservations, count).build();
  }

  async getListByDriver(driverId: string): Promise<ListInterface<Reservation>> {
    const [reservations, count] =
      await this.reservationRepo.getAllByDriver(driverId);

    return new ListBuilder(reservations, count).build();
  }

  async assignDriver(
    id: string,
    driverId: string,
    vehicleId: string,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepo.getOneById(id);
    const driver = await this.driverRepo.getOneById(driverId);
    const vehicle = await this.vehicleRepository.getOneById(vehicleId);

    if (vehicle.driver.id !== driver.id) {
      throw new ReservationDriverVehicleMismatchException();
    }

    // Accessibility check
    await this.ensureAccessibilityCompatible(
      reservation.customer.user.id,
      vehicle.id,
    );

    reservation.driver = driver;
    reservation.vehicle = vehicle;
    reservation.status = ReservationStatusEnum.Accepted;

    return await this.reservationRepo.save(reservation);
  }

  async unassignDriver(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepo.getOneById(id);

    reservation.driver = undefined;
    reservation.vehicle = undefined;
    reservation.status = ReservationStatusEnum.Pending;

    return await this.reservationRepo.save(reservation);
  }

  async reschedule(id: string, newScheduledAt: Date): Promise<Reservation> {
    const reservation = await this.reservationRepo.getOneById(id);

    reservation.scheduledAt = newScheduledAt;

    return await this.reservationRepo.save(reservation);
  }

  async markInProgress(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepo.getOneById(id);

    this.reservationService.validateStatusTransition(
      reservation.status,
      ReservationStatusEnum.InProgress,
    );

    reservation.status = ReservationStatusEnum.InProgress;
    return await this.reservationRepo.save(reservation);
  }

  async markCompleted(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepo.getOneById(id);

    this.reservationService.validateStatusTransition(
      reservation.status,
      ReservationStatusEnum.Completed,
    );

    reservation.status = ReservationStatusEnum.Completed;
    return await this.reservationRepo.save(reservation);
  }

  async getActiveByCustomer(customerId: string) {
    const [reservations, count] =
      await this.reservationRepo.getActiveByCustomer(customerId);

    return new ListBuilder(reservations, count).build();
  }

  async getActiveByDriver(driverId: string) {
    const [reservations, count] =
      await this.reservationRepo.getActiveByDriver(driverId);

    return new ListBuilder(reservations, count).build();
  }

  async getHistoryByCustomer(customerId: string) {
    const [reservations, count] =
      await this.reservationRepo.getHistoryByCustomer(customerId);

    return new ListBuilder(reservations, count).build();
  }

  async getHistoryByDriver(driverId: string) {
    const [reservations, count] =
      await this.reservationRepo.getHistoryByDriver(driverId);

    return new ListBuilder(reservations, count).build();
  }

  private async ensureAccessibilityCompatible(
    userId: string,
    vehicleId?: string,
  ) {
    if (!vehicleId) return;

    const [userFeatures] =
      await this.userAccessibilityRepository.getFeaturesByUserId(userId);

    if (!userFeatures.length) return;

    const [vehicleFeatures] =
      await this.vehicleAccessibilityRepository.getFeaturesByVehicleId(
        vehicleId,
      );

    const vehicleSet = new Set(
      vehicleFeatures.map((f) => f.name.toLowerCase()),
    );
    const missing = userFeatures
      .map((f) => f.name)
      .filter((need) => !vehicleSet.has(need.toLowerCase()));

    if (missing.length) {
      throw new ReservationAccessibilityMismatchException(missing);
    }
  }

  async getAvailableForDriver(driverId: string): Promise<
    {
      reservation: Reservation;
      distance: number;
    }[]
  > {
    const driver = await this.driverRepo.getOneById(driverId);

    if (!driver.currentLat || !driver.currentLng) {
      return []; // driver must share location
    }

    // Fetch all pending reservations
    const [reservations] = await this.reservationRepo.getAllPending();

    const results: { reservation: Reservation; distance: number }[] = [];

    for (const reservation of reservations) {
      // Skip if reservation already has a driver
      if (reservation.driver) continue;

      // Driver must have at least one vehicle
      const vehicles = driver.vehicles ?? [];

      if (!vehicles.length) continue;

      // Check each vehicle
      let compatible = false;

      for (const vehicle of vehicles) {
        const match = await this.accessibilityMatchingService.match(
          reservation.customer.user.id,
          vehicle.id,
        );

        if (match.isCompatible) {
          compatible = true;
          break;
        }
      }

      if (!compatible) continue;

      // Distance in meters
      const distance = haversine(
        { lat: driver.currentLat, lon: driver.currentLng },
        { lat: reservation.pickupLat, lon: reservation.pickupLng },
      );

      results.push({ reservation, distance });
    }

    // Sort closest first
    results.sort((a, b) => a.distance - b.distance);

    return results;
  }
}
