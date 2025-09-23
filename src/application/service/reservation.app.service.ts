import { Injectable } from '@nestjs/common';

import { Reservation } from '../../domain/entity/reservation.entity';
import { ReservationStatusEnum } from '../../domain/enums/reservation-status.enum';
import { ReservationInvalidStateException } from '../../domain/exception/reservation/reservation-invalid-state.exception';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { ReservationRepository } from '../../infrastructure/repository/reservation.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { VehicleRepository } from '../../infrastructure/repository/vehicle.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { ReservationCreateRequestDto } from '../dto/reservation/reservation-create-request.dto';
import { ReservationUpdateStatusRequestDto } from '../dto/reservation/reservation-update-status-request.dto';

@Injectable()
export class ReservationAppService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly userRepository: UserRepository,
    private readonly driverProfileRepository: DriverProfileRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async create(
    userId: string,
    dto: ReservationCreateRequestDto,
  ): Promise<Reservation> {
    const user = await this.userRepository.getOneById(userId);

    const r = new Reservation();

    r.user = user;
    r.type = dto.type;
    r.status = ReservationStatusEnum.Pending;
    r.pickupLat = dto.pickupLat;
    r.pickupLng = dto.pickupLng;
    r.dropoffLat = dto.dropoffLat;
    r.dropoffLng = dto.dropoffLng;
    r.scheduledAt = dto.scheduledAt ?? null;

    // TODO: placeholder estimation
    r.priceEstimate = null;

    return await this.reservationRepository.save(r);
  }

  async getById(id: string): Promise<Reservation> {
    return this.reservationRepository.getOneById(id);
  }

  async getList(): Promise<ListInterface<Reservation>> {
    const [rows, count] = await this.reservationRepository.getAll();

    return new ListBuilder(rows, count).build();
  }

  async getByUser(userId: string): Promise<ListInterface<Reservation>> {
    const [rows, count] =
      await this.reservationRepository.getAllByUserId(userId);

    return new ListBuilder(rows, count).build();
  }

  async updateStatus(
    id: string,
    dto: ReservationUpdateStatusRequestDto,
  ): Promise<Reservation> {
    const r = await this.reservationRepository.getOneById(id);

    if (
      r.status === ReservationStatusEnum.Completed ||
      r.status === ReservationStatusEnum.Cancelled
    ) {
      throw new ReservationInvalidStateException(
        `Cannot transition from ${r.status}`,
      );
    }

    r.status = dto.status;
    return await this.reservationRepository.save(r);
  }
}
