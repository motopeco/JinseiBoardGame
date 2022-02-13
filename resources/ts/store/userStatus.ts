import { Module } from 'vuex'
import { UserStatusState, RootState } from '@/store/state'
import UserStatus = SocketServerData.UserStatus

export const userStatusModule: Module<UserStatusState, RootState> = {
  namespaced: true,
  state: {
    status: 0,
    roomId: -1,
    gameData: undefined,
  },
  mutations: {
    update(state, userStatus: UserStatus) {
      state.roomId = userStatus.roomId
      state.gameData = userStatus.gameData
    },
  },
}
