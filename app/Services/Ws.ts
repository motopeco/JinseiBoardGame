import { Server, Socket } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import Firebase from 'App/Services/Firebase'
import Logger from '@ioc:Adonis/Core/Logger'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import AuthController from 'App/Controllers/Ws/AuthController'
import GameController from 'App/Controllers/Ws/GameController'
import SocketClientEvent from '../../constants/SocketClientEvent'
import RoomController from 'App/Controllers/Ws/RoomController'
import User from 'App/Models/User'

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
        // idTokenから認証処理
        socket.data = idToken
        const authController = new AuthController(socket)
        await authController.login(idToken)

        return next()
      }

      return next(new Error('authentication error'))
    })

    this.io.on('connection', async (socket) => {
      // 復帰処理
      const idToken = socket.data as DecodedIdToken
      await User.websocketComebackProcess(idToken.uid, socket)
      // WebSocketルーティング
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
    const game = new GameController(socket)

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
          break
        case SocketClientEvent.ReadyGame:
          await game.ready(callback)
          break
        case SocketClientEvent.StartGame:
          await game.start(callback)
          break
        case SocketClientEvent.DoNextGame:
          await game.next(callback)
          break
        case SocketClientEvent.GetRooms:
          await room.getRoomList(callback)
      }
    })
  }
}

export default new Ws()
