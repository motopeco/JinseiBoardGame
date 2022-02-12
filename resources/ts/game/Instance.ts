import { Store } from 'vuex'
import { RootState } from '@/store/state'
import Phaser from 'phaser'
import Preload from '@/game/scenes/Preload'
import Game from '@/game/scenes/Game'
import plugin from '@/game/plugin'
import Menu from '@/game/scenes/Menu'

export default class Instance {
  private store: Store<RootState>
  private readonly game: Phaser.Game

  constructor(store: Store<RootState>) {
    this.store = store

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      },
      scene: [Preload, Game, Menu],
      plugins: plugin,
    }

    this.game = new Phaser.Game(config)
    this.game.config.store = store
  }

  public run() {
    this.game.events.emit('run')
  }

  public getGame() {
    return this.game
  }
}
