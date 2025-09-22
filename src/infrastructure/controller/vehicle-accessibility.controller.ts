import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { VehicleAccessibilityResponseDto } from '../../application/dto/accessibility/vehicle/vehicle-accessibility-response.dto';
import { VehicleAccessibilityAppService } from '../../application/service/vehicle-accessibility.app.service';

@ApiTags('vehicle-accessibility')
@Controller('vehicle/:vehicleId/accessibility')
@ApiBearerAuth('JWT-auth')
export class VehicleAccessibilityController {
  constructor(
    private readonly vehicleAccessibilityAppService: VehicleAccessibilityAppService,
  ) {}

  @ApiOperation({ summary: 'Get all accessibility features for a vehicle' })
  @ApiResponse({ type: VehicleAccessibilityResponseDto, status: HttpStatus.OK })
  @Get('vehicle/:vehicleId')
  async getVehicleAccessibility(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
  ) {
    const list =
      await this.vehicleAccessibilityAppService.getVehicleAccessibility(
        vehicleId,
      );

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(list, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Add feature to vehicle' })
  @ApiResponse({
    type: VehicleAccessibilityResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('vehicle/:vehicleId/feature/:featureId')
  async addFeature(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @Param('featureId', new ParseUUIDPipe()) featureId: string,
  ) {
    const vehicleAcc =
      await this.vehicleAccessibilityAppService.addFeatureToVehicle(
        vehicleId,
        featureId,
      );

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(vehicleAcc, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Remove feature from vehicle' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete('vehicle/:vehicleId/feature/:featureId')
  async removeFeature(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @Param('featureId', new ParseUUIDPipe()) featureId: string,
  ) {
    await this.vehicleAccessibilityAppService.removeFeatureFromVehicle(
      vehicleId,
      featureId,
    );

    return { statusCode: HttpStatus.NO_CONTENT };
  }
}
