import Button from 'phaser3-rex-plugins/plugins/input/button/Button'
import websocket from '@/plugins/websocket'
import SocketClientEvent from '../../../../constants/SocketClientEvent'
import UIPlugins from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import GridTable from 'phaser3-rex-plugins/templates/ui/gridtable/GridTable'
import IConfig = GridTable.IConfig
import RoomTable from '@/game/objects/RoomTable'
import { Store } from 'vuex'
import { RootState } from '@/store/state'
import LobbyPlayerInfo from '@/game/objects/LobbyPlayerInfo'

export default class Lobby extends Phaser.Scene {
  private rexUI: UIPlugins

  constructor() {
    super({ key: 'Lobby', active: false })
  }

  public create() {
    const playerInfo = new LobbyPlayerInfo(this)
    this.add.existing(playerInfo)

    const rect = this.add.rectangle(400, 300, 100, 50, 0xffffff).setOrigin(0.5)
    const startButton = new Button(rect)
    startButton.on('click', () => {
      console.log('click')
      websocket.getIO().emit(SocketClientEvent.ReadyGame, {}, (response) => {
        console.log(response)
      })
    })

    const store = this.game.config.store as Store<RootState>
    store.watch(
      (state) => state.userStatus.gameData,
      (gameData) => {
        console.log('update')
        if (!gameData) return

        console.log(gameData.players)
        playerInfo.updatePlayer(gameData.players)
      }
    )
  }
}
