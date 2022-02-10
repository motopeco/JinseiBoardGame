import { Socket } from 'socket.io'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import User from 'App/Models/User'
import SocketEvent from '../../../constants/SocketEvent'

export default class AuthController {
  public async login(socket: Socket, idToken: DecodedIdToken) {
    const uid = idToken.uid
    const user = await User.createUserIfNotExist(uid)

    const data: SocketData.Auth = { uid: user.uid }

    socket.emit(SocketEvent.Auth, data)
  }
}
