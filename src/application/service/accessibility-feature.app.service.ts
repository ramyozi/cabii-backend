import { Injectable } from '@nestjs/common';

import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';
import { AccessibilityFeatureRepository } from '../../infrastructure/repository/accessibility-feature.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { AccessibilityFeatureCreateRequestDto } from '../dto/accessibility/accessibility-feature-create-request.dto';
import { AccessibilityFeatureUpdateRequestDto } from '../dto/accessibility/accessibility-feature-update-request.dto';

@Injectable()
export class AccessibilityFeatureAppService {
  constructor(
    private readonly featureRepository: AccessibilityFeatureRepository,
  ) {}

  async create(
    dto: AccessibilityFeatureCreateRequestDto,
  ): Promise<AccessibilityFeature> {
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

    feature.name = dto.name ?? feature.name;
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
