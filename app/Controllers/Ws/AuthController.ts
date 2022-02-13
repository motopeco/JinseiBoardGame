import { Socket } from 'socket.io'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import User from 'App/Models/User'
import SocketEvent from '../../../constants/SocketEvent'
import SocketServerEvent from '../../../constants/SocketServerEvent'
import BaseController from 'App/Controllers/Ws/BaseController'

export default class AuthController extends BaseController {
  public async login(idToken: DecodedIdToken) {
    const uid = idToken.uid
    const user = await User.createUserIfNotExist(uid)
  }

  public async getUser(callback: any) {
    const idToken = this.socket.data as DecodedIdToken
    const uid = idToken.uid
    const user = await User.getUserByUID(uid)
    if (!user) {
      throw new Error('foobar')
    }

    const data: SocketServerData.GetUserResult = { uid: user.uid }
    callback(data)
  }
}
