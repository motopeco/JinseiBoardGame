import { Module } from 'vuex'
import { DebugState, RootState } from '@/store/state'

export const debugStateModule: Module<DebugState, RootState> = {
  namespaced: true,
  state: {
    events: [],
  },
  mutations: {
    add(state, result) {
      console.log(result)
      state.events.unshift(result)
    },
  },
}
