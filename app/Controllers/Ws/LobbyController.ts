import { Socket } from 'socket.io'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import BaseController from 'App/Controllers/Ws/BaseController'

export default class LobbyController extends BaseController {
  public async index(msg) {
    // const idToken = socket.data as DecodedIdToken
    //

    console.log(msg)
  }
}
