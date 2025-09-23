import { ApiProperty } from '@nestjs/swagger';

import { DeliveryReceiver } from '../../../domain/entity/delivery-receiver.entity';
import { BaseResponseDto } from '../base.response.dto';

export class DeliveryReceiverResponseDto extends BaseResponseDto {
  @ApiProperty({ type: DeliveryReceiver })
  declare data: DeliveryReceiver;
}
