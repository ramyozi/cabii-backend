import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import { Server, Socket } from 'socket.io';

import { DriverLocationCreateRequestDto } from '../../application/dto/driver-location/driver-location-create-request.dto';
import { DriverLocationResponseDto } from '../../application/dto/driver-location/driver-location-response.dto';
import { AuthService } from '../../application/service/auth.service';
import { DriverLocationAppService } from '../../application/service/driver-location.app.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class DriverLocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(DriverLocationGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly locationService: DriverLocationAppService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Run when a new client connects
   */
  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers['authorization'];

      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      // strip "Bearer "
      const rawToken = token.toString().replace(/^Bearer\s+/i, '');
      const claims = await this.authService.decodeToken(rawToken);

      (client as any).userId = claims.userId; // store for later use
      this.logger.log(`Client connected: userId=${claims.userId}`);
    } catch (e) {
      this.logger.warn(`Connection refused: ${e.message}`);
      client.disconnect(true);
    }
  }

  /**
   * Run when a client disconnects
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${(client as any).userId}`);
  }

  /**
   * Driver pushes location updates
   */
  @SubscribeMessage('driver:location:update')
  async handleDriverLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { driverId: string; dto: DriverLocationCreateRequestDto },
  ): Promise<DriverLocationResponseDto> {
    this.logger.debug(`Location update from driver ${payload.driverId}`);

    const loc = await this.locationService.record(
      payload.driverId,
      payload.dto,
    );

    const response = new DriverLocationResponseDto();

    response.statusCode = 201;
    response.data = loc;

    // broadcast to only subscribers of this driver
    this.server
      .to(`driver:${payload.driverId}`)
      .emit(`driver:${payload.driverId}:location`, instanceToPlain(response));

    return response;
  }

  /**
   * Rider subscribes to driver location updates
   */
  @SubscribeMessage('subscribe:driver')
  handleSubscribeDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() driverId: string,
  ) {
    client.join(`driver:${driverId}`);
    return { status: 'subscribed', driverId };
  }

  /**
   * Rider unsubscribes
   */
  @SubscribeMessage('unsubscribe:driver')
  handleUnsubscribeDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() driverId: string,
  ) {
    client.leave(`driver:${driverId}`);
    return { status: 'unsubscribed', driverId };
  }

  /**
   * Driver pushes ETA updates for a reservation
   */
  @SubscribeMessage('driver:eta:update')
  async handleDriverEtaUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { reservationId: string; etaMinutes: number },
  ) {
    this.logger.debug(
      `ETA update for reservation ${payload.reservationId}: ${payload.etaMinutes} min`,
    );

    // broadcast only to subscribers of this reservation
    this.server
      .to(`reservation:${payload.reservationId}`)
      .emit(`reservation:${payload.reservationId}:eta`, {
        etaMinutes: payload.etaMinutes,
      });

    return { status: 'ok' };
  }

  /**
   * Rider subscribes to reservation ETA updates
   */
  @SubscribeMessage('subscribe:reservation')
  handleSubscribeReservation(
    @ConnectedSocket() client: Socket,
    @MessageBody() reservationId: string,
  ) {
    client.join(`reservation:${reservationId}`);
    return { status: 'subscribed', reservationId };
  }

  /**
   * Rider unsubscribes from reservation ETA updates
   */
  @SubscribeMessage('unsubscribe:reservation')
  handleUnsubscribeReservation(
    @ConnectedSocket() client: Socket,
    @MessageBody() reservationId: string,
  ) {
    client.leave(`reservation:${reservationId}`);
    return { status: 'unsubscribed', reservationId };
  }
}
