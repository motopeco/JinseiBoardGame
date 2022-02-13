import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { uid } from 'uid/secure'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

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
}
