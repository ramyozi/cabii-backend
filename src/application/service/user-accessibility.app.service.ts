import { Injectable } from '@nestjs/common';

import { UserAccessibility } from '../../domain/entity/user-accessibility.entity';
import { AccessibilityFeatureRepository } from '../../infrastructure/repository/accessibility-feature.repository';
import { UserAccessibilityRepository } from '../../infrastructure/repository/user-accessibility.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { ListBuilder, ListInterface } from '../common/list';

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

    const userAcc = new UserAccessibility();

    userAcc.user = user;
    userAcc.feature = feature;

    return await this.userAccessibilityRepository.save(userAcc);
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

  async getUserAccessibility(
    userId: string,
  ): Promise<ListInterface<UserAccessibility>> {
    const [userAccessibilities, count] =
      await this.userAccessibilityRepository.getAllByUserId(userId);

    return new ListBuilder(userAccessibilities, count).build();
  }
}
