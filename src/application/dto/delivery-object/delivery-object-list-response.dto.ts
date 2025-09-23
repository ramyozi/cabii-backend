import { ApiProperty } from '@nestjs/swagger';

import { DeliveryObject } from '../../../domain/entity/delivery-object.entity';
import { ListResponseDto } from '../list.response.dto';

export class DeliveryObjectListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [DeliveryObject] })
  declare data: DeliveryObject[];
}
