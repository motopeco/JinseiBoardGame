import io, { Socket } from 'socket.io-client'

class WebSocket {
  private io: Socket

  public connect(token: string) {
    this.io = io({
      auth: {
        token,
      },
    })

    this.io.on('connect', () => {
      console.log('connect')
    })
  }

  public getIO() {
    return this.io
  }
}

export default new WebSocket()
