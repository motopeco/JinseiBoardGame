import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Hash from '@ioc:Adonis/Core/Hash'
import GameStatus from '../../constants/GameStatus'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public password: string

  @column()
  public gameData: GameData

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async createData(name: string, password: string, trx: TransactionClientContract) {
    const room = new Room()
    room.useTransaction(trx)
    room.name = name
    room.password = await Hash.make(password)
    room.gameData = {
      isStart: false,
      status: 0,
      players: [],
      turnPlayer: 0,
      turnNumber: 0,
      ownerPlayerId: -1,
      gameMap: {
        name: 'サンプルマップ',
        board: [],
      },
    }

    await room.save()

    return room
  }

  public static async getRoom(roomId: number, trx?: TransactionClientContract) {
    const query = Room.query().where('id', roomId)
    if (trx) {
      query.forUpdate().noWait()
      query.useTransaction(trx)
    }

    return query.first()
  }
}
