import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DriverDocument } from '../../domain/entity/driver-document.entity';
import { DriverDocumentNotFoundException } from '../../domain/exception/driver-document/driver-document-not-found.exception';

@Injectable()
export class DriverDocumentRepository extends Repository<DriverDocument> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(DriverDocument, entityManager || dataSource!.createEntityManager());
  }

  async getOneById(id: string) {
    const doc = await this.createQueryBuilder('driverDocument')
      .where('driverDocument.id = :id', { id })
      .getOne();

    if (!doc) {
      throw new DriverDocumentNotFoundException(
        `Driver document with id ${id} not found`,
      );
    }

    return doc;
  }

  async getAllByDriverId(
    driverId: string,
  ): Promise<[DriverDocument[], number]> {
    const qb = this.createQueryBuilder('driverDocument')
      .innerJoin('driverDocument.driver', 'driver')
      .where('driver.id = :driverId', { driverId })
      .orderBy('driverDocument.createdAt', 'DESC');

    return await qb.getManyAndCount();
  }
}
