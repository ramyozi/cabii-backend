import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { DriverLocationCreateRequestDto } from '../../application/dto/driver-location/driver-location-create-request.dto';
import { DriverLocationAppService } from '../../application/service/driver-location.app.service';

@ApiTags('driver-location')
@Controller('driver-location')
@ApiBearerAuth('JWT-auth')
export class DriverLocationController {
  constructor(private readonly service: DriverLocationAppService) {}

  @ApiOperation({ summary: 'Record driver location sample' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('driver/:driverId')
  async record(
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
    @Body(new ValidationPipe()) dto: DriverLocationCreateRequestDto,
  ) {
    const loc = await this.service.record(driverId, dto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(loc, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get latest driver location' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('driver/:driverId/latest')
  async latest(@Param('driverId', new ParseUUIDPipe()) driverId: string) {
    const loc = await this.service.latest(driverId);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(loc, { strategy: 'exposeAll' }),
    };
  }
}
