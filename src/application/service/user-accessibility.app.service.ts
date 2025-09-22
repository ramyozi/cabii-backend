import { Injectable } from '@nestjs/common';

import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';
import { UserAccessibility } from '../../domain/entity/user-accessibility.entity';
import { UserAccessibilityNotFoundException } from '../../domain/exception/accessibility/user-accessibility-not-found.exception';
import { AccessibilityFeatureRepository } from '../../infrastructure/repository/accessibility-feature.repository';
import { UserAccessibilityRepository } from '../../infrastructure/repository/user-accessibility.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { UserAccessibilityAlreadyExistsException } from '../dto/accessibility/user/user-accessibility-already-exists.exception';

@Injectable()
export class UserAccessibilityAppService {
  constructor(
    private readonly userAccessibilityRepository: UserAccessibilityRepository,
    private readonly accessibilityFeatureRepository: AccessibilityFeatureRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async addFeatureToUser(
    userId: string,
    featureId: string,
  ): Promise<UserAccessibility> {
    const user = await this.userRepository.getOneById(userId);
    const feature =
      await this.accessibilityFeatureRepository.getOneById(featureId);

    try {
      await this.userAccessibilityRepository.getByUserAndFeature(
        userId,
        featureId,
      );

      throw new UserAccessibilityAlreadyExistsException(userId, featureId);
    } catch (error) {
      if (error instanceof UserAccessibilityNotFoundException) {
        const userAcc = new UserAccessibility();

        userAcc.user = user;
        userAcc.feature = feature;

        return await this.userAccessibilityRepository.save(userAcc);
      }

      throw error;
    }
  }

  async removeFeatureFromUser(
    userId: string,
    featureId: string,
  ): Promise<void> {
    const userAcc = await this.userAccessibilityRepository.getByUserAndFeature(
      userId,
      featureId,
    );

    await this.userAccessibilityRepository.remove(userAcc);
  }

  async getAccessibilityFeatures(
    userId: string,
  ): Promise<ListInterface<AccessibilityFeature>> {
    const [features, count] =
      await this.userAccessibilityRepository.getFeaturesByUserId(userId);

    const list = new ListBuilder(features, count);

    return list.build();
  }
}
