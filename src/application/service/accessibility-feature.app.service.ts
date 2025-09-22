import { Injectable } from '@nestjs/common';

import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';
import { AccessibilityFeatureNotFoundException } from '../../domain/exception/accessibility/accessibility-feature-not-found.exception';
import { AccessibilityFeatureRepository } from '../../infrastructure/repository/accessibility-feature.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { AccessibilityFeatureCreateRequestDto } from '../dto/accessibility/accessibility-feature-create-request.dto';
import { AccessibilityFeatureNameTakenException } from '../dto/accessibility/accessibility-feature-name-taken.exception';
import { AccessibilityFeatureUpdateRequestDto } from '../dto/accessibility/accessibility-feature-update-request.dto';

@Injectable()
export class AccessibilityFeatureAppService {
  constructor(
    private readonly featureRepository: AccessibilityFeatureRepository,
  ) {}

  async create(
    dto: AccessibilityFeatureCreateRequestDto,
  ): Promise<AccessibilityFeature> {
    try {
      await this.featureRepository.getByName(dto.name);
      throw new AccessibilityFeatureNameTakenException(dto.name);
    } catch (e) {
      if (!(e instanceof AccessibilityFeatureNotFoundException)) {
        throw e;
      }
    }

    const feature = new AccessibilityFeature();

    feature.name = dto.name;
    feature.description = dto.description;
    feature.icon = dto.icon;
    feature.category = dto.category;

    return await this.featureRepository.save(feature);
  }

  async update(
    id: string,
    dto: AccessibilityFeatureUpdateRequestDto,
  ): Promise<AccessibilityFeature> {
    const feature = await this.featureRepository.getOneById(id);

    if (dto.name && dto.name !== feature.name) {
      try {
        await this.featureRepository.getByName(dto.name);

        throw new AccessibilityFeatureNameTakenException(dto.name);
      } catch (e) {
        if (!(e instanceof AccessibilityFeatureNotFoundException)) {
          throw e;
        }
      }
      feature.name = dto.name;
    }

    feature.description = dto.description ?? feature.description;
    feature.icon = dto.icon ?? feature.icon;
    feature.category = dto.category ?? feature.category;

    return await this.featureRepository.save(feature);
  }

  async getById(id: string): Promise<AccessibilityFeature> {
    return await this.featureRepository.getOneById(id);
  }

  async getByName(name: string): Promise<AccessibilityFeature> {
    return await this.featureRepository.getByName(name);
  }

  async getList(): Promise<ListInterface<AccessibilityFeature>> {
    const [features, count] = await this.featureRepository.getAll();

    return new ListBuilder(features, count).build();
  }
}
