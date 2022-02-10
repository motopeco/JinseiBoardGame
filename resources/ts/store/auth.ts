import { Module } from 'vuex'
import { AuthState, RootState } from '@/store/state'

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: {
    uid: '',
  },
  mutations: {
    login(state, uid) {
      state.uid = uid
    },
  },
}
