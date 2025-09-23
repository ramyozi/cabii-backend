import { Injectable } from '@nestjs/common';

import { RidePassenger } from '../../domain/entity/ride-passenger.entity';
import { ReservationRepository } from '../../infrastructure/repository/reservation.repository';
import { RidePassengerRepository } from '../../infrastructure/repository/ride-passenger.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { RidePassengerCreateRequestDto } from '../dto/ride-passenger/ride-passenger-create-request.dto';

@Injectable()
export class RidePassengerAppService {
  constructor(
    private readonly repo: RidePassengerRepository,
    private readonly reservationRepo: ReservationRepository,
  ) {}

  async create(dto: RidePassengerCreateRequestDto): Promise<RidePassenger> {
    const res = await this.reservationRepo.getOneById(dto.reservationId);

    const passenger = new RidePassenger();

    passenger.reservation = res;
    passenger.name = dto.name;
    passenger.age = dto.age;
    passenger.hasReducedMobility = dto.hasReducedMobility;

    return await this.repo.save(passenger);
  }

  async getById(id: string): Promise<RidePassenger> {
    return await this.repo.getOneById(id);
  }

  async getList(): Promise<ListInterface<RidePassenger>> {
    const [passengers, count] = await this.repo.getAll();

    return new ListBuilder(passengers, count).build();
  }
}
