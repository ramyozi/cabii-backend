import { ApiProperty } from '@nestjs/swagger';

import { DriverDocument } from '../../../domain/entity/driver-document.entity';
import { ListResponseDto } from '../list.response.dto';

export class DriverDocumentListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [DriverDocument] })
  declare data: DriverDocument[];
}
