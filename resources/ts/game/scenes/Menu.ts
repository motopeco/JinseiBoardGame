import Button from 'phaser3-rex-plugins/plugins/input/button/Button'
import websocket from '@/plugins/websocket'
import SocketClientEvent from '../../../../constants/SocketClientEvent'
import UIPlugins from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import GridTable from 'phaser3-rex-plugins/templates/ui/gridtable/GridTable'
import IConfig = GridTable.IConfig
import RoomTable from '@/game/objects/RoomTable'

export default class Menu extends Phaser.Scene {
  private rexUI: UIPlugins

  constructor() {
    super({ key: 'Menu', active: false })
  }

  public create() {
    const rect = this.add.rectangle(100, 100, 300, 50, 0xffffff).setOrigin(0)
    const startButton = new Button(rect)
    startButton.on('click', () => {
      console.log('click')
    })
  }
}
