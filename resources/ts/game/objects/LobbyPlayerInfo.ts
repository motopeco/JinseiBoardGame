import ready from 'webpack-dev-middleware/types/utils/ready'

export default class LobbyPlayerInfo extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene)

    for (let i = 0; i < 4; i++) {
      const container = scene.add.container(100 + 150 * i, 50).setName(`player${i}`)
      const box = scene.add.rectangle(0, 0, 150, 100, 0xffffff).setOrigin(0)
      container.add(box)

      const label = scene.add
        .text(5, 5, `プレイヤー${i + 1}`, { color: 'black' })
        .setPadding(5)
        .setOrigin(0)
      container.add(label)

      const playerName = scene.add.text(5, 30, 'XXXXXXXXX', { color: 'black' })
        .setPadding(5)
        .setOrigin(0)
        .setName('playerName')
      container.add(playerName)

      const readyStatus = scene.add.text(5, 60, '準備: -', { color: 'black' })
        .setPadding(5)
        .setOrigin(0)
        .setName('readyStatus')
      container.add(readyStatus)

      this.add(container)
    }
  }

  public updatePlayer(players: GamePlayer[]) {
    for (const player of players) {
      const index = player.turnIndex
      const container = this.getByName(`player${index}`) as Phaser.GameObjects.Container
      if (!container) continue

      const playerName = container.getByName(`playerName`) as Phaser.GameObjects.Text
      playerName.setText(`[${player.playerId}]`)

      const readyStatus = container.getByName('readyStatus') as Phaser.GameObjects.Text
      if (player.isReady) {
        readyStatus.setText('準備: ○')
      } else {
        readyStatus.setText('準備: ×')
      }
    }
  }
}
