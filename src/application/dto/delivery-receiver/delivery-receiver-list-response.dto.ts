import { ApiProperty } from '@nestjs/swagger';

import { DeliveryReceiver } from '../../../domain/entity/delivery-receiver.entity';
import { ListResponseDto } from '../list.response.dto';

export class DeliveryReceiverListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [DeliveryReceiver] })
  declare data: DeliveryReceiver[];
}
