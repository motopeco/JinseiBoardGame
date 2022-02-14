import { Module } from 'vuex'
import { UserStatusState, RootState } from '@/store/state'
import UserStatus = SocketServerData.UserStatus

export const userStatusModule: Module<UserStatusState, RootState> = {
  namespaced: true,
  state: {
    roomId: -1,
    gameData: undefined,
  },
  mutations: {
    update(state, userStatus: UserStatus) {
      state.roomId = userStatus.roomId
      state.gameData = userStatus.gameData
    },
    leaveRoom(state) {
      state.roomId = -0
      state.gameData = undefined
    },
  },
}
