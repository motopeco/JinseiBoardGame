import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin'
import ButtonPlugin from 'phaser3-rex-plugins/plugins/button-plugin'

const plugin: Phaser.Types.Core.PluginObject = {
  global: [
    {
      key: 'rexButton',
      plugin: ButtonPlugin,
      start: true,
    },
  ],
  scene: [
    {
      key: 'rexBoard',
      plugin: BoardPlugin,
      mapping: 'rexBoard',
    },
  ],
}

export default plugin
