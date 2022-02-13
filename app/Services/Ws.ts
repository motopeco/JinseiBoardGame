import { Server, Socket } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import Firebase from 'App/Services/Firebase'
import Logger from '@ioc:Adonis/Core/Logger'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import AuthController from 'App/Controllers/Ws/AuthController'
import LobbyController from 'App/Controllers/Ws/LobbyController'
import MenuController from 'App/Controllers/Ws/MenuController'
import SocketClientEvent from '../../constants/SocketClientEvent'
import RoomController from 'App/Controllers/Ws/RoomController'

class Ws {
  public io: Server
  private booted = false

  public boot() {
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!)
    this.io.use(async (socket, next) => {
      console.log('middleware')
      const token = socket.handshake.auth.token

      if (typeof token !== 'string') {
        return next(new Error('authentication error'))
      }

      const idToken = await this.getIdToken(token)

      if (idToken) {
        socket.data = idToken
        const authController = new AuthController(socket)
        await authController.login(idToken)

        return next()
      }

      return next(new Error('authentication error'))
    })

    this.io.on('connection', (socket) => {
      this.route(socket)
    })
  }

  private async getIdToken(token: string): Promise<DecodedIdToken | null> {
    try {
      return await Firebase.getApp().auth().verifyIdToken(token, true)
    } catch (e) {
      Logger.error(e)
      return null
    }
  }

  private route(socket: Socket) {
    const auth = new AuthController(socket)
    const room = new RoomController(socket)
    const menu = new MenuController(socket)
    const lobby = new LobbyController(socket)

    socket.onAny(async (event, args, callback) => {
      switch (event) {
        case SocketClientEvent.GetUser:
          await auth.getUser(callback)
          break
        case SocketClientEvent.CreateNewRoom:
          await room.createNewRoom(args, callback)
          break
        case SocketClientEvent.JoinRoom:
          await room.joinRoom(args, callback)
          break
        case SocketClientEvent.LeaveRoom:
          await room.leaveRoom(callback)
      }
    })
  }
}

export default new Ws()
