import { Injectable } from '@nestjs/common';

import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';
import { AccessibilityFeatureNotFoundException } from '../../domain/exception/accessibility/accessibility-feature-not-found.exception';
import { AccessibilityFeatureRepository } from '../../infrastructure/repository/accessibility-feature.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { AccessibilityFeatureCreateRequestDto } from '../dto/accessibility/accessibility-feature-create-request.dto';

@Injectable()
export class AccessibilityFeatureAppService {
  constructor(private readonly repo: AccessibilityFeatureRepository) {}

  async getList(): Promise<ListInterface<AccessibilityFeature>> {
    const [features, count] = await this.repo.getAll();

    return new ListBuilder(features, count).build();
  }

  async getOneById(id: string): Promise<AccessibilityFeature> {
    const feature = await this.repo.findOneBy({ id });

    if (!feature) throw new AccessibilityFeatureNotFoundException(id);

    return feature;
  }

  async create(
    dto: AccessibilityFeatureCreateRequestDto,
  ): Promise<AccessibilityFeature> {
    const feature = new AccessibilityFeature();

    feature.name = dto.name;
    feature.description = dto.description;
    feature.icon = dto.icon;
    feature.category = dto.category;

    return await this.repo.save(feature);
  }
}
