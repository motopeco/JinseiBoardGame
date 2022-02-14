import { Socket } from 'socket.io'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import BaseController from 'App/Controllers/Ws/BaseController'
import Logger from '@ioc:Adonis/Core/Logger'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import RoomUser from 'App/Models/RoomUser'
import CommonResult = SocketServerData.CommonResult
import Room from 'App/Models/Room'
import Game from 'App/Models/Utils/Game'
import Event from '@ioc:Adonis/Core/Event'

export default class GameController extends BaseController {
  public async ready(callback: any) {
    const trx = await Database.transaction()
    const result: CommonResult = { isSuccess: false }

    try {
      const { user, roomUser } = await this.getUserAndRoomUser(trx)
      if (!user || !roomUser) {
        await trx.rollback()
        return callback(result)
      }

      const isOk = await Game.toggleReadyUser(Number(user.id), roomUser.roomId, trx)
      if (!isOk) {
        await trx.rollback()
        return callback(result)
      }

      await trx.commit()

      await Event.emit('notification', roomUser.roomId)
      result.isSuccess = true
      return callback(result)
    } catch (e) {
      Logger.error(e)
      await trx.rollback()
      return callback(result)
    }
  }

  public async start(callback: any) {
    const trx = await Database.transaction()
    const result: CommonResult = { isSuccess: false }

    try {
      const { user, roomUser } = await this.getUserAndRoomUser(trx)
      if (!user || !roomUser) {
        await trx.rollback()
        return callback(result)
      }

      const isOk = await Game.start(Number(user.id), Number(roomUser.roomId), trx)
      if (!isOk) {
        await trx.rollback()
        return callback(result)
      }

      await trx.commit()

      await Event.emit('notification', roomUser.roomId)
      result.isSuccess = true
      return callback(result)
    } catch (e) {
      Logger.error(e)
      await trx.rollback()
      return callback(result)
    }
  }

  public async next(callback: any) {
    const trx = await Database.transaction()
    const result: CommonResult = { isSuccess: false }

    try {
      const { user, roomUser } = await this.getUserAndRoomUser(trx)
      if (!user || !roomUser) {
        await trx.rollback()
        return callback(result)
      }

      const isOk = await Game.next(Number(user.id), Number(roomUser.roomId), trx)
      if (!isOk) {
        await trx.rollback()
        return callback(result)
      }

      await trx.commit()

      await Event.emit('notification', roomUser.roomId)
      result.isSuccess = true
      return callback(result)
    } catch (e) {
      Logger.error(e)
      await trx.rollback()
      return callback(result)
    }
  }

  private async getUserAndRoomUser(trx: TransactionClientContract) {
    const idToken = this.socket.data as DecodedIdToken

    const user = await User.getUserByUID(idToken.uid, trx)
    if (!user) {
      return { user: null, roomUser: null }
    }

    const roomUser = await RoomUser.getByPlayerId(user.id, trx)
    if (!roomUser) {
      return { user: null, roomUser: null }
    }

    return { user, roomUser }
  }
}
