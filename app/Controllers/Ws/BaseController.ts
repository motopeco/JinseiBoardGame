import { Socket } from 'socket.io'

export default class BaseController {
  protected socket: Socket

  constructor(socket: Socket) {
    this.socket = socket
  }
}
