import { BadRequestException } from '@nestjs/common';

export class ReservationAccessibilityMismatchException extends BadRequestException {
  constructor(public readonly missingFeatureNames: string[]) {
    super(
      `Vehicle does not satisfy user's accessibility needs: ${missingFeatureNames.join(
        ', ',
      )}`,
    );
  }
}
