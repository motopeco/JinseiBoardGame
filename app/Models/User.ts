import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { uid } from 'uid/secure'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import RoomUser from 'App/Models/RoomUser'
import { Socket } from 'socket.io'
import Event from '@ioc:Adonis/Core/Event'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async createUserIfNotExist(firebaseUID: string) {
    const name = uid()

    return await User.firstOrCreate({ uid: firebaseUID }, { name })
  }

  public static async getUserByUID(uid: string, trx?: TransactionClientContract) {
    const query = User.query().where('uid', uid)
    if (trx) {
      query.useTransaction(trx)
    }

    return await query.first()
  }

  public static async websocketComebackProcess(uid: string, socket: Socket) {
    const user = await this.getUserByUID(uid)
    if (!user) return

    const roomUser = await RoomUser.getByPlayerId(user.id)
    if (roomUser) {
      socket.join(`room${roomUser.roomId}`)

      await Event.emit('notification', roomUser.roomId)
    }
  }
}
