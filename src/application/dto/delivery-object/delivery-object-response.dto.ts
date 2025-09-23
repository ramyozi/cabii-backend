import { ApiProperty } from '@nestjs/swagger';

import { DeliveryObject } from '../../../domain/entity/delivery-object.entity';
import { BaseResponseDto } from '../base.response.dto';

export class DeliveryObjectResponseDto extends BaseResponseDto {
  @ApiProperty({ type: DeliveryObject })
  declare data: DeliveryObject;
}
