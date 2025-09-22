import {
  Controller,
  Delete,
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

import { UserAccessibilityResponseDto } from '../../application/dto/accessibility/user/user-accessibility-response.dto';
import { UserAccessibilityAppService } from '../../application/service/user-accessibility.app.service';

@ApiTags('user-accessibility')
@Controller('user-accessibility')
@ApiBearerAuth('JWT-auth')
export class UserAccessibilityController {
  constructor(
    private readonly userAccessibilityAppService: UserAccessibilityAppService,
  ) {}

  @ApiOperation({ summary: 'Add feature to user' })
  @ApiResponse({
    type: UserAccessibilityResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('user/:userId/feature/:featureId')
  async addFeature(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('featureId', new ParseUUIDPipe()) featureId: string,
  ) {
    const userAcc = await this.userAccessibilityAppService.addFeatureToUser(
      userId,
      featureId,
    );

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(userAcc, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Remove feature from user' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete('user/:userId/feature/:featureId')
  async removeFeature(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Param('featureId', new ParseUUIDPipe()) featureId: string,
  ) {
    await this.userAccessibilityAppService.removeFeatureFromUser(
      userId,
      featureId,
    );

    return { statusCode: HttpStatus.NO_CONTENT };
  }
}
