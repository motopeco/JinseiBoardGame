import { Socket } from 'socket.io'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import BaseController from 'App/Controllers/Ws/BaseController'

export default class GameController extends BaseController {
  public async ready(msg) {
    console.log(msg)
  }
}
