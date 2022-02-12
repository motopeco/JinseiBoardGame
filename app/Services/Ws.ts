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
        const authController = new AuthController()
        await authController.login(socket, idToken)

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
    const menu = new MenuController(socket)
    socket.on(SocketClientEvent.ClickStartButton, menu.onClickStartButton)

    const lobby = new LobbyController(socket)
    socket.on('lobbies', lobby.index)
  }
}

export default new Ws()
