import { Injectable } from '@nestjs/common';

import { DeliveryObject } from '../../domain/entity/delivery-object.entity';
import { DeliveryObjectRepository } from '../../infrastructure/repository/delivery-object.repository';
import { DeliveryReceiverRepository } from '../../infrastructure/repository/delivery-receiver.repository';
import { ReservationRepository } from '../../infrastructure/repository/reservation.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { DeliveryObjectCreateRequestDto } from '../dto/delivery-object/delivery-object-create-request.dto';
import { DeliveryObjectUpdateRequestDto } from '../dto/delivery-object/delivery-object-update-request.dto';

@Injectable()
export class DeliveryObjectAppService {
  constructor(
    private readonly repo: DeliveryObjectRepository,
    private readonly receiverRepo: DeliveryReceiverRepository,
    private readonly reservationRepo: ReservationRepository,
  ) {}

  async create(dto: DeliveryObjectCreateRequestDto): Promise<DeliveryObject> {
    const res = await this.reservationRepo.getOneById(dto.reservationId);
    const receiver = await this.receiverRepo.getOneById(dto.receiverId);

    const obj = new DeliveryObject();

    obj.reservation = res;
    obj.receiver = receiver;
    obj.label = dto.label;
    obj.weight = dto.weight;
    obj.description = dto.description;

    return await this.repo.save(obj);
  }

  async update(
    id: string,
    dto: DeliveryObjectUpdateRequestDto,
  ): Promise<DeliveryObject> {
    const obj = await this.repo.getOneById(id);

    obj.label = dto.label ?? obj.label;
    obj.weight = dto.weight ?? obj.weight;
    obj.description = dto.description ?? obj.description;

    return await this.repo.save(obj);
  }

  async getById(id: string): Promise<DeliveryObject> {
    return await this.repo.getOneById(id);
  }

  async getList(): Promise<ListInterface<DeliveryObject>> {
    const [objects, count] = await this.repo.getAll();
    const list = new ListBuilder(objects, count);

    return list.build();
  }
}
