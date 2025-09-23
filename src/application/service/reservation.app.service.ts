import { Injectable } from '@nestjs/common';

import { Reservation } from '../../domain/entity/reservation.entity';
import { ReservationStatusEnum } from '../../domain/enums/reservation-status.enum';
import { ReservationAlreadyCompletedException } from '../../domain/exception/reservation/reservation-already-completed.exception';
import { ReservationCannotCancelException } from '../../domain/exception/reservation/reservation-cannot-cancel.exception';
import { ReservationDriverVehicleMismatchException } from '../../domain/exception/reservation/reservation-driver-vehicle-mismatch.exception';
import { ReservationInvalidStatusTransitionException } from '../../domain/exception/reservation/reservation-invalid-status-transition.exception';
import { CustomerProfileRepository } from '../../infrastructure/repository/customer-profile.repository';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { ReservationRepository } from '../../infrastructure/repository/reservation.repository';
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
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async create(dto: ReservationCreateRequestDto): Promise<Reservation> {
    const customer = await this.customerRepo.getOneById(dto.customerId);
    const driver = dto.driverId
      ? await this.driverRepo.getOneById(dto.driverId)
      : undefined;

    const vehicle = dto.vehicleId
      ? await this.vehicleRepo.getOneById(dto.vehicleId)
      : undefined;

    if (driver && vehicle && vehicle.driver.id !== driver.id) {
      throw new ReservationDriverVehicleMismatchException();
    }

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
      this.validateStatusTransition(reservation.status, dto.status);
      reservation.status = dto.status;
    }

    if (dto.driverId) {
      const driver = await this.driverRepo.getOneById(dto.driverId);

      if (dto.vehicleId) {
        const vehicle = await this.vehicleRepo.getOneById(dto.vehicleId);

        if (reservation.driver && vehicle.driver.id !== reservation.driver.id) {
          throw new ReservationDriverVehicleMismatchException();
        }

        reservation.vehicle = vehicle;
      }

      reservation.driver = driver;
    } else if (dto.vehicleId) {
      throw new ReservationDriverVehicleMismatchException();
    }

    reservation.scheduledAt = dto.scheduledAt ?? reservation.scheduledAt;

    return await this.reservationRepo.save(reservation);
  }

  private validateStatusTransition(
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
}
