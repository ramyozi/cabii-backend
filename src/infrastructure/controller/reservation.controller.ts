import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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

import { ReservationAssignDriverDto } from '../../application/dto/reservation/reservation-assign-driver.dto';
import { ReservationCreateRequestDto } from '../../application/dto/reservation/reservation-create-request.dto';
import { ReservationListResponseDto } from '../../application/dto/reservation/reservation-list-response.dto';
import { ReservationRescheduleDto } from '../../application/dto/reservation/reservation-reschedule.dto';
import { ReservationResponseDto } from '../../application/dto/reservation/reservation-response.dto';
import { ReservationUpdateRequestDto } from '../../application/dto/reservation/reservation-update-request.dto';
import { ReservationAppService } from '../../application/service/reservation.app.service';
import { Reservation } from '../../domain/entity/reservation.entity';

@ApiTags('reservation')
@Controller('reservation')
@ApiBearerAuth('JWT-auth')
export class ReservationController {
  constructor(private readonly reservationAppService: ReservationAppService) {}

  @ApiOperation({ summary: 'Create a reservation' })
  @ApiResponse({ type: Reservation, status: HttpStatus.CREATED })
  @Post()
  async create(@Body(new ValidationPipe()) dto: ReservationCreateRequestDto) {
    const reservation = await this.reservationAppService.create(dto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Update reservation' })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: ReservationUpdateRequestDto,
  ) {
    const reservation = await this.reservationAppService.update(id, dto);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Cancel reservation' })
  @ApiResponse({ type: Reservation, status: HttpStatus.OK })
  @Patch(':id/cancel')
  async cancel(@Param('id', new ParseUUIDPipe()) id: string) {
    const reservation = await this.reservationAppService.cancel(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get reservation by id' })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const reservation = await this.reservationAppService.getById(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'List all reservations' })
  @ApiResponse({ type: ReservationListResponseDto, status: HttpStatus.OK })
  @Get()
  async getList() {
    const reservations = await this.reservationAppService.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(reservations, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Assign driver and vehicle to reservation' })
  @Patch(':id/assign-driver')
  async assignDriver(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: ReservationAssignDriverDto,
  ) {
    const reservation = await this.reservationAppService.assignDriver(
      id,
      dto.driverId,
      dto.vehicleId,
    );

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Unassign driver and vehicle from reservation' })
  @Patch(':id/unassign-driver')
  async unassignDriver(@Param('id', new ParseUUIDPipe()) id: string) {
    const reservation = await this.reservationAppService.unassignDriver(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Reschedule reservation' })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id/reschedule')
  async reschedule(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: ReservationRescheduleDto,
  ) {
    const reservation = await this.reservationAppService.reschedule(
      id,
      dto.newScheduledAt,
    );

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Mark reservation as in-progress' })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id/in-progress')
  async markInProgress(@Param('id', new ParseUUIDPipe()) id: string) {
    const reservation = await this.reservationAppService.markInProgress(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Mark reservation as completed' })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id/completed')
  async markCompleted(@Param('id', new ParseUUIDPipe()) id: string) {
    const reservation = await this.reservationAppService.markCompleted(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get active reservations by customer' })
  @ApiResponse({ type: ReservationListResponseDto, status: HttpStatus.OK })
  @Get('customer/:customerId/active')
  async getActiveByCustomer(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ) {
    const reservations =
      await this.reservationAppService.getActiveByCustomer(customerId);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(reservations, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get active reservations by driver' })
  @ApiResponse({ type: ReservationListResponseDto, status: HttpStatus.OK })
  @Get('driver/:driverId/active')
  async getActiveByDriver(
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
  ) {
    const reservations =
      await this.reservationAppService.getActiveByDriver(driverId);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(reservations, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get reservation history by customer' })
  @ApiResponse({ type: ReservationListResponseDto, status: HttpStatus.OK })
  @Get('customer/:customerId/history')
  async getHistoryByCustomer(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ) {
    const reservations =
      await this.reservationAppService.getHistoryByCustomer(customerId);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(reservations, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get reservation history by driver' })
  @ApiResponse({ type: ReservationListResponseDto, status: HttpStatus.OK })
  @Get('driver/:driverId/history')
  async getHistoryByDriver(
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
  ) {
    const reservations =
      await this.reservationAppService.getHistoryByDriver(driverId);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(reservations, { strategy: 'exposeAll' }),
    };
  }
}
