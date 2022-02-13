import { Socket } from 'socket.io'

export default class BaseController {
  public socket: Socket

  constructor(socket: Socket) {
    this.socket = socket
  }
}
