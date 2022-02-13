import io, { Socket } from 'socket.io-client'
import { Store } from 'vuex'
import { RootState } from '@/store/state'
import SocketEvent from '../../../constants/SocketEvent'
import SocketServerEvent from '../../../constants/SocketServerEvent'
import SocketClientEvent from '../../../constants/SocketClientEvent'

class WebSocket {
  private io: Socket
  private store: Store<RootState>

  public setStore(store: Store<RootState>) {
    this.store = store
  }

  public connect(token: string) {
    this.io = io({
      auth: {
        token,
      },
    })

    this.io.on('connect', () => {
      console.log('connect')

      this.io.emit(SocketClientEvent.GetUser, {}, (result: SocketServerData.GetUserResult) => {
        this.store.commit('auth/login', result.uid)
      })
    })
  }

  public getIO() {
    return this.io
  }
}

export default new WebSocket()
