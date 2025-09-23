import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessibilityMatchingAppService } from '../../application/service/accessibility-matching.app.service';

@ApiTags('accessibility-matching')
@Controller('accessibility-matching')
@ApiBearerAuth('JWT-auth')
export class AccessibilityMatchingController {
  constructor(
    private readonly matchingService: AccessibilityMatchingAppService,
  ) {}

  @ApiOperation({
    summary:
      'Check if a user is compatible with a vehicle based on accessibility features',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        statusCode: 200,
        data: {
          isCompatible: true,
          missingFeatures: [],
        },
      },
    },
  })
  @Get('user/:userId/vehicle/:vehicleId')
  async match(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
  ) {
    const result = await this.matchingService.match(userId, vehicleId);

    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
