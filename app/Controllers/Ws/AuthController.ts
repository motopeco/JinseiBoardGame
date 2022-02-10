import { Socket } from 'socket.io'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import User from 'App/Models/User'

export default class AuthController {
  public async login(socket: Socket, idToken: DecodedIdToken) {
    const uid = idToken.uid
    await User.createUserIfNotExist(uid)
    socket.emit('auth', 'ok')
  }
}
