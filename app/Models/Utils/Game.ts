import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Room from 'App/Models/Room'

export default class Game {
  private constructor() {
    //
  }

  public static async toggleReadyUser(
    userId: number,
    roomId: number,
    trx: TransactionClientContract
  ) {
    const room = await Room.getRoom(roomId, trx)
    if (!room) {
      return false
    }

    const gameData = room.gameData
    const index = gameData.players.findIndex((p) => {
      return Number(p.playerId) === userId
    })
    if (index < 0) return false

    const player = gameData.players[index]

    player.isReady = !player.isReady
    gameData.players[index] = player
    room.gameData = gameData

    room.useTransaction(trx)
    await room.save()
  }

  public static async next(userId: number, roomId: number, trx: TransactionClientContract) {
    const room = await Room.getRoom(roomId, trx)
    if (!room) {
      return false
    }

    const gameData = room.gameData
    const index = gameData.players.findIndex((p) => {
      return Number(p.playerId) === userId
    })
    if (index < 0) return false

    const player = gameData.players[index]
    if (gameData.turnPlayer !== player.playerId) return
  }
}
