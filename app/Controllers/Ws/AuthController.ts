import { Socket } from 'socket.io'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken

export default class AuthController {
  public async login(socket: Socket, idToken: DecodedIdToken) {
    const uid = idToken.uid
    socket.emit('auth', 'ok')
  }
}
