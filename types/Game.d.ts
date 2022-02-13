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

declare interface GamePlayer {
  // プレイヤーの順番
  turnIndex: number
  // プレイヤーID
  playerId: number
  // 準備フラグ
  isReady: boolean
  // お金
  money: number
  x: number
  y: number
}

declare interface GameData {
  // ゲーム開始フラグ
  isStart: boolean
  // ゲームステータス
  // 0: ターン開始
  // 1: ルーレット表示
  // 2: ルーレット回転中
  // 3: ルーレット停止中
  // 4: ルーレット停止・結果表示
  // 5: コマ移動
  // 6: コマ結果確認
  // 7: コマ結果表示
  // 8: ターン終了
  status: number
  players: GamePlayer[]
  turnPlayer: number
  // ターン数
  turnNumber: number
}
