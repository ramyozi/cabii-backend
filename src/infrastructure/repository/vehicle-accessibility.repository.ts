import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';
import { VehicleAccessibility } from '../../domain/entity/vehicle-accessibility.entity';
import { VehicleAccessibilityNotFoundException } from '../../domain/exception/accessibility/vehicle-accessibility-not-found.exception';

@Injectable()
export class VehicleAccessibilityRepository extends Repository<VehicleAccessibility> {
  constructor(
    private entityManager?: EntityManager,
    private dataSource?: DataSource,
  ) {
    if (!dataSource && !entityManager) {
      throw new Error(
        'Cannot instantiate repository without dataSource or entityManager',
      );
    }

    super(
      VehicleAccessibility,
      entityManager || dataSource!.createEntityManager(),
    );
  }

  async getById(id: string): Promise<VehicleAccessibility> {
    const va = await this.createQueryBuilder('va')
      .leftJoinAndSelect('va.feature', 'feature')
      .leftJoinAndSelect('va.vehicle', 'vehicle')
      .where('va.id = :id', { id })
      .getOne();

    if (!va) {
      throw new VehicleAccessibilityNotFoundException(
        `VehicleAccessibility with id ${id} not found`,
      );
    }

    return va;
  }

  async getByVehicleAndFeature(
    vehicleId: string,
    featureId: string,
  ): Promise<VehicleAccessibility> {
    const va = await this.createQueryBuilder('va')
      .leftJoinAndSelect('va.feature', 'feature')
      .leftJoinAndSelect('va.vehicle', 'vehicle')
      .where('va.vehicle.id = :vehicleId', { vehicleId })
      .andWhere('va.feature.id = :featureId', { featureId })
      .getOne();

    if (!va) {
      throw new VehicleAccessibilityNotFoundException(
        `VehicleAccessibility not found for vehicle ${vehicleId} and feature ${featureId}`,
      );
    }

    return va;
  }

  async getFeaturesByVehicleId(
    vehicleId: string,
  ): Promise<[AccessibilityFeature[], number]> {
    const qb = this.createQueryBuilder('va')
      .leftJoinAndSelect('va.feature', 'feature')
      .where('va.vehicle.id = :vehicleId', { vehicleId });

    const [vehicleAccessibilities, count] = await qb.getManyAndCount();
    const features = vehicleAccessibilities.map((va) => va.feature);

    return [features, count];
  }
}
