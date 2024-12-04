import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({
  cors: {
    origin: '*', // Permitir conexiones desde cualquier origen
  },
})
export class LogGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log('Cliente conectado:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Cliente desconectado:', client.id);
  }

  sendLog(message: string) {
    this.server.emit('log', message); // Emitir un evento 'log' a todos los clientes conectados
  }

  sendProgress(progress: number) {
    this.server.emit('progress', progress); // Emitir un evento 'progress' a todos los clientes conectados
  }
}
