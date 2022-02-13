import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin'
import ButtonPlugin from 'phaser3-rex-plugins/plugins/button-plugin'
import UIPlugins from 'phaser3-rex-plugins/templates/ui/ui-plugin'

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
    {
      key: 'rexUI',
      plugin: UIPlugins,
      mapping: 'rexUI',
    },
  ],
}

export default plugin
