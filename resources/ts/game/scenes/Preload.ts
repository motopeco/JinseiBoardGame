import { Store } from 'vuex'
import { RootState } from '@/store/state'

export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload', active: true })
  }

  public create() {
    this.game.events.once('run', () => {
      console.log('run!')
    })
  }

  public update() {
    const store = this.game.config.store as Store<RootState>
    if (store.state.auth.id) {
      this.scene.start('Menu')
    }
  }
}
