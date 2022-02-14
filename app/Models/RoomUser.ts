import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Room from 'App/Models/Room'

export default class RoomUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roomId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async isUserExistJoinRoom(userId: number, trx: TransactionClientContract) {
    const roomUsers = await RoomUser.query().useTransaction(trx).where('user_id', userId)
    return roomUsers.length > 0
  }

  public static async joinRoom(roomId: number, userId: number, trx: TransactionClientContract) {
    const room = await Room.query().useTransaction(trx).where('id', roomId).first()
    if (!room) throw new Error('room not found')

    console.log(room.gameData.players)

    room.gameData.ownerPlayerId = userId

    room.gameData.players.push({
      turnIndex: room.gameData.players.length,
      playerId: Number(userId),
      isReady: false,
      money: 0,
      x: 0,
      y: 0,
    })
    room.useTransaction(trx)
    await room.save()

    const roomUser = new RoomUser()
    roomUser.useTransaction(trx)
    roomUser.roomId = roomId
    roomUser.userId = userId
    await roomUser.save()

    return roomUser
  }

  public static async leaveAllRoom(roomId: number, userId: number, trx: TransactionClientContract) {
    const room = await Room.query().useTransaction(trx).where('id', roomId).first()
    if (!room) throw new Error('room not found')

    const gameData = room.gameData
    gameData.players = gameData.players.filter((p) => p.playerId !== userId)
    room.useTransaction(trx)
    room.gameData = gameData
    await room.save()

    await RoomUser.query().useTransaction(trx).where('user_id', userId).delete()
  }

  public static async getByPlayerId(userId: number, trx?: TransactionClientContract) {
    const query = RoomUser.query()
    if (trx) query.useTransaction(trx)

    return await query.where('user_id', userId).first()
  }
}
