import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Room from 'App/Models/Room'
import GameProcess from 'App/Models/Utils/GameProcess'

export default class Game {
  private constructor() {
    //
  }

  private static gameProcesses = new Map<Number, GameProcess>()

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
    if (gameData.isStart) {
      return false
    }

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

    return true
  }

  public static async start(userId: number, roomId: number, trx: TransactionClientContract) {
    const room = await Room.getRoom(roomId, trx)
    if (!room) {
      return false
    }

    const gameData = room.gameData
    if (gameData.ownerPlayerId !== userId) {
      return false
    }

    if (gameData.isStart) {
      return false
    }

    const notReady = gameData.players.find((p) => {
      return p.isReady === false
    })
    if (notReady) {
      return false
    }

    const firstPlayer = gameData.players.find((p) => p.turnIndex === 0)
    if (!firstPlayer) return false

    gameData.turnPlayer = firstPlayer.playerId

    gameData.isStart = true
    room.gameData = gameData
    room.useTransaction(trx)
    await room.save()

    this.gameProcesses.set(roomId, new GameProcess())

    return true
  }

  public static async next(userId: number, roomId: number, trx: TransactionClientContract) {
    const room = await Room.getRoom(roomId, trx)
    if (!room) {
      return false
    }

    const gameData = room.gameData

    if (!gameData.isStart) {
      return false
    }

    const index = gameData.players.findIndex((p) => {
      return Number(p.playerId) === userId
    })
    if (index < 0) return false

    const player = gameData.players[index]
    if (gameData.turnPlayer !== player.playerId) return false

    const process = this.gameProcesses.get(roomId) as GameProcess
    room.gameData = await process!!.next(userId, roomId, gameData)

    room.useTransaction(trx)
    await room.save()

    return true
  }
}
