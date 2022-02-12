import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin'
import { QuadGrid } from 'phaser3-rex-plugins/plugins/board-components'
import gameMap from '@/game/utils/gameMap'

export default class Game extends Phaser.Scene {
  private rexBoard: BoardPlugin

  constructor() {
    super({ key: 'Game', active: false })
  }

  public create() {
    const camera = this.cameras.main
    camera.setViewport(0, 0, 800, 600)

    const board = this.rexBoard.add.board({
      grid: new QuadGrid({
        x: 0,
        y: 0,
        cellWidth: 64,
        cellHeight: 64,
        type: 'orthogonal',
      }),
      width: 100,
      height: 100,
    })

    this.rexBoard.createTileTexture(board, 'tile', 0xffffff)

    board.forEachTileXY(({ x, y }, b) => {
      const gm = gameMap.find((gm) => gm.x === x && gm.y === y)
      if (gm) {
        this.add
          .rectangle(x * 64, y * 64, 64, 64, gm.fill)
          .setStrokeStyle(1, 0x000000)
          .setOrigin(0)
      }
    })

    this.add.rectangle(0, 0, 300, 50, 0x222222).setOrigin(0).setScrollFactor(0, 0)
  }

  public update() {
    // this.cameras.main.scrollX++
  }
}
