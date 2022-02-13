import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

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
    const roomUser = new RoomUser()
    roomUser.useTransaction(trx)
    roomUser.roomId = roomId
    roomUser.userId = userId
    await roomUser.save()

    return roomUser
  }

  public static async leaveAllRoom(userId: number, trx: TransactionClientContract) {
    await RoomUser.query().useTransaction(trx).where('user_id', userId).delete()
  }
}
