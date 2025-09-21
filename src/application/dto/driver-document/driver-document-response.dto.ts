import { ApiProperty } from '@nestjs/swagger';

import { DriverDocument } from '../../../domain/entity/driver-document.entity';
import { BaseResponseDto } from '../base.response.dto';

export class DriverDocumentResponseDto extends BaseResponseDto {
  @ApiProperty({ type: DriverDocument })
  declare data: DriverDocument;
}
