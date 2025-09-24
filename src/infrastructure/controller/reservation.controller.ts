import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { ReservationAssignDriverDto } from '../../application/dto/reservation/reservation-assign-driver.dto';
import { ReservationCreateRequestDto } from '../../application/dto/reservation/reservation-create-request.dto';
import {
  EtaUpdateDto,
  PackageActionDto,
  PassengerOnBoardDto,
} from '../../application/dto/reservation/reservation-execution.dto';
import { ReservationListResponseDto } from '../../application/dto/reservation/reservation-list-response.dto';
import { ReservationRescheduleDto } from '../../application/dto/reservation/reservation-reschedule.dto';
import { ReservationResponseDto } from '../../application/dto/reservation/reservation-response.dto';
import { ReservationUpdateRequestDto } from '../../application/dto/reservation/reservation-update-request.dto';
import { ReservationExecutionAppService } from '../../application/service/reservation-execution.app.service';
import { ReservationAppService } from '../../application/service/reservation.app.service';
import { Reservation } from '../../domain/entity/reservation.entity';
import { ActiveRoleEnum } from '../../domain/enums/active-role.enum';
import { JwtAuthGuard } from '../decorator/auth/jwt-auth.guard';
import { Roles } from '../decorator/auth/roles.decorator';
import { RolesGuard } from '../decorator/auth/roles.guard';

@ApiTags('reservation')
@Controller('reservation')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationController {
  constructor(
    private readonly reservationAppService: ReservationAppService,
    private readonly reservationExecService: ReservationExecutionAppService,
  ) {}

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
  @Roles([ActiveRoleEnum.Customer])
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
    const reservation = await this.reservationAppService.assignDriver(id, dto);

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

  @ApiOperation({ summary: 'Driver arrived at pickup point' })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Roles([ActiveRoleEnum.Driver])
  @Patch(':id/arrived')
  async driverArrived(@Param('id', new ParseUUIDPipe()) id: string) {
    const reservation = await this.reservationExecService.driverArrived(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Passenger on board (ride only)' })
  @ApiBody({ type: PassengerOnBoardDto })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id/passenger-onboard')
  async passengerOnBoard(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: PassengerOnBoardDto,
  ) {
    const reservation = await this.reservationExecService.passengerOnBoard(
      id,
      dto,
    );

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Start trip' })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Roles([ActiveRoleEnum.Driver])
  @Patch(':id/start')
  async startTrip(@Param('id', new ParseUUIDPipe()) id: string) {
    const reservation = await this.reservationExecService.startTrip(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Complete trip' })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id/complete')
  async completeTrip(@Param('id', new ParseUUIDPipe()) id: string) {
    const reservation = await this.reservationExecService.completeTrip(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Package picked up (delivery only)' })
  @ApiBody({ type: PackageActionDto })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id/package-picked-up')
  async packagePickedUp(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: PackageActionDto,
  ) {
    const reservation = await this.reservationExecService.packagePickedUp(
      id,
      dto,
    );

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Package delivered (delivery only)' })
  @ApiBody({ type: PackageActionDto })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id/package-delivered')
  async packageDelivered(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: PackageActionDto,
  ) {
    const reservation = await this.reservationExecService.packageDelivered(
      id,
      dto,
    );

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Update ETA and distance to destination' })
  @ApiBody({ type: EtaUpdateDto })
  @ApiResponse({ type: ReservationResponseDto, status: HttpStatus.OK })
  @Patch(':id/eta')
  async etaUpdated(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: EtaUpdateDto,
  ) {
    const reservation = await this.reservationExecService.etaUpdated(id, dto);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(reservation, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'List events for a reservation' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get(':id/events')
  async getEvents(@Param('id', new ParseUUIDPipe()) id: string) {
    const events = await this.reservationExecService.getEvents(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(events, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'List available reservations for driver' })
  @ApiResponse({
    type: ReservationListResponseDto,
    status: HttpStatus.OK,
    description: 'Closest compatible reservations for driver',
  })
  @Get('available/driver/:driverId')
  async getAvailableForDriver(
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
  ) {
    const matches =
      await this.reservationAppService.getAvailableForDriver(driverId);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(matches, { strategy: 'exposeAll' }),
    };
  }
}
