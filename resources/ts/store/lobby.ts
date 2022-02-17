import { Module } from 'vuex'
import { RootState, LobbyState } from '@/store/state'

export const lobbyModule: Module<LobbyState, RootState> = {
  namespaced: true,
  state: {
    rooms: [],
  },
  mutations: {
    update(state, { rooms }) {
      state.rooms = rooms
    },
  },
}
