import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Room management
  @SubscribeMessage('join:restaurant')
  handleJoinRestaurant(client: Socket, restaurantId: string) {
    client.join(`restaurant:${restaurantId}`);
    this.logger.log(`Client ${client.id} joined restaurant:${restaurantId}`);
    return { event: 'joined', data: { restaurantId } };
  }

  @SubscribeMessage('leave:restaurant')
  handleLeaveRestaurant(client: Socket, restaurantId: string) {
    client.leave(`restaurant:${restaurantId}`);
    this.logger.log(`Client ${client.id} left restaurant:${restaurantId}`);
    return { event: 'left', data: { restaurantId } };
  }

  // Event emitters (to be called from services)
  emitToRestaurant(restaurantId: string, event: string, data: any) {
    this.server.to(`restaurant:${restaurantId}`).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  emitToClient(clientId: string, event: string, data: any) {
    this.server.to(clientId).emit(event, data);
  }

  // Reservation-specific events
  emitReservationCreated(restaurantId: string, reservation: any) {
    this.emitToRestaurant(restaurantId, 'reservation:created', { reservation });
    this.logger.log(`Reservation created event emitted for restaurant ${restaurantId}`);
  }

  emitReservationUpdated(restaurantId: string, reservation: any) {
    this.emitToRestaurant(restaurantId, 'reservation:updated', { reservation });
    this.logger.log(`Reservation updated event emitted for restaurant ${restaurantId}`);
  }

  emitReservationCancelled(restaurantId: string, reservation: any) {
    this.emitToRestaurant(restaurantId, 'reservation:cancelled', { reservation });
    this.logger.log(`Reservation cancelled event emitted for restaurant ${restaurantId}`);
  }

  emitReservationConfirmed(restaurantId: string, reservation: any) {
    this.emitToRestaurant(restaurantId, 'reservation:confirmed', { reservation });
    this.logger.log(`Reservation confirmed event emitted for restaurant ${restaurantId}`);
  }

  emitReservationSeated(restaurantId: string, reservation: any) {
    this.emitToRestaurant(restaurantId, 'reservation:seated', { reservation });
    this.logger.log(`Reservation seated event emitted for restaurant ${restaurantId}`);
  }

  emitReservationCompleted(restaurantId: string, reservation: any) {
    this.emitToRestaurant(restaurantId, 'reservation:completed', { reservation });
    this.logger.log(`Reservation completed event emitted for restaurant ${restaurantId}`);
  }

  emitReservationNoShow(restaurantId: string, reservation: any) {
    this.emitToRestaurant(restaurantId, 'reservation:no-show', { reservation });
    this.logger.log(`Reservation no-show event emitted for restaurant ${restaurantId}`);
  }
}
