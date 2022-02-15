import io, { Socket } from 'socket.io-client'
import { Store } from 'vuex'
import { RootState } from '@/store/state'
import SocketEvent from '../../../constants/SocketEvent'
import SocketServerEvent from '../../../constants/SocketServerEvent'
import SocketClientEvent from '../../../constants/SocketClientEvent'
import UserStatus = SocketServerData.UserStatus

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

      setTimeout(() => {
        this.io.emit(SocketClientEvent.GetUser, {}, (result: SocketServerData.GetUserResult) => {
          this.store.commit('auth/login', result.id)
        })
      }, 100)
    })

    this.io.onAny((event, result) => {
      this.store.commit('debug/add', { event, result })

      switch (event) {
        case SocketServerEvent.UserStatus:
          this.store.commit('userStatus/update', result)
          break
      }
    })
  }

  public getIO() {
    return this.io
  }
}

export default new WebSocket()
