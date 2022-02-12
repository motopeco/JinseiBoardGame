// import { Store } from 'vuex'
// import { RootState } from '@/store/state'

declare module Phaser {
  namespace Core {
    interface Config {
      store: any
    }
  }
}

declare interface GameMapData {
  x: number
  y: number
  fill: number
}
