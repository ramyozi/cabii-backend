import { DriverDocumentTypeEnum } from '../../domain/enums/driver-document-type.enum';
import { DriverDocumentBadExpiryDateException } from '../../domain/exception/driver-document/driver-document-bad-expiry-date.exception';

/**
 * Returns a valid expiry date for a document.
 * If expiryDate is provided, validates it; if not, calculates default based on type.
 */
export function validateExpiryDate(
  documentType: DriverDocumentTypeEnum,
  expiryDate?: Date,
): Date {
  const now = new Date();

  // Determine default expiry if none provided
  const maxYears = (() => {
    switch (documentType) {
      case DriverDocumentTypeEnum.DRIVER_LICENSE:
        return 5;
      case DriverDocumentTypeEnum.VEHICLE_REGISTRATION:
        return 3;
      case DriverDocumentTypeEnum.INSURANCE:
      case DriverDocumentTypeEnum.MEDICAL_CLEARANCE:
        return 1;
      case DriverDocumentTypeEnum.ID_CARD:
        return 10;
      default:
        return 5;
    }
  })();

  const finalExpiry =
    expiryDate ?? new Date(now.setFullYear(now.getFullYear() + maxYears));

  if (finalExpiry < new Date())
    throw new DriverDocumentBadExpiryDateException(
      'Expiry date cannot be in the past.',
    );

  if (
    finalExpiry >
    new Date(new Date().setFullYear(new Date().getFullYear() + maxYears))
  ) {
    throw new DriverDocumentBadExpiryDateException(
      `Expiry date cannot exceed ${maxYears} year(s) from today.`,
    );
  }

  return finalExpiry;
}
