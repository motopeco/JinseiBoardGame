import { Module } from 'vuex'
import { AuthState, RootState } from '@/store/state'

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: {
    id: -1,
  },
  mutations: {
    login(state, id) {
      state.id = id
    },
  },
}
