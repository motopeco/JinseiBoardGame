import BaseController from 'App/Controllers/Ws/BaseController'
import { auth } from 'firebase-admin'
import DecodedIdToken = auth.DecodedIdToken
import Database from '@ioc:Adonis/Lucid/Database'
import Room from 'App/Models/Room'
import User from 'App/Models/User'
import RoomUser from 'App/Models/RoomUser'
import Logger from '@ioc:Adonis/Core/Logger'

export default class RoomController extends BaseController {
  public async createNewRoom(data: SocketClientData.CreateRoomData, callback: any) {
    const trx = await Database.transaction()
    const result: SocketServerData.CreateNewRoomResult = { isSuccess: false }

    try {
      const idToken = this.socket.data as DecodedIdToken
      const uid = idToken.uid

      const user = await User.getUserByUID(uid, trx)
      if (!user) {
        await trx.rollback()
        // TODO Error
        return callback(result)
      }

      const isExistJoinRoom = await RoomUser.isUserExistJoinRoom(user.id, trx)
      if (isExistJoinRoom) {
        await trx.rollback()
        return callback(result)
      }

      const room = await Room.createData(data.name, data.password, trx)
      await RoomUser.joinRoom(room.id, user.id, trx)
      await trx.commit()

      result.isSuccess = true
      return callback(result)
    } catch (e) {
      Logger.error(e)
      await trx.rollback()
      // TODO Error
      return callback(result)
    }
  }

  public async joinRoom(data: SocketClientData.JoinRoomData, callback: any) {
    const trx = await Database.transaction()
    const result: SocketServerData.JoinRoomResult = { isSuccess: false }

    try {
      const idToken = this.socket.data as DecodedIdToken
      const uid = idToken.uid

      const user = await User.getUserByUID(uid, trx)
      if (!user) {
        await trx.rollback()
        // TODO Error
        return callback(result)
      }

      const isExistJoinRoom = await RoomUser.isUserExistJoinRoom(user.id, trx)
      if (isExistJoinRoom) {
        await trx.rollback()
        return callback(result)
      }

      const room = await Room.getRoom(data.roomId, trx)
      if (!room) {
        await trx.rollback()
        return callback(result)
      }

      await RoomUser.joinRoom(room.id, user.id, trx)
      await trx.commit()

      result.isSuccess = true
      return callback(result)
    } catch (e) {
      Logger.error(e)
      await trx.rollback()
      // TODO Error
      return callback(result)
    }
  }

  public async leaveRoom(callback: any) {
    const trx = await Database.transaction()
    const result: SocketServerData.JoinRoomResult = { isSuccess: false }

    try {
      const idToken = this.socket.data as DecodedIdToken
      const uid = idToken.uid

      const user = await User.getUserByUID(uid, trx)
      if (!user) {
        await trx.rollback()
        // TODO Error
        return callback(result)
      }

      const isExistJoinRoom = await RoomUser.isUserExistJoinRoom(user.id, trx)
      if (!isExistJoinRoom) {
        await trx.rollback()
        return callback(result)
      }

      await RoomUser.leaveAllRoom(user.id, trx)
      await trx.commit()

      result.isSuccess = true
      return callback(result)
    } catch (e) {
      Logger.error(e)
      await trx.rollback()
      // TODO Error
      return callback(result)
    }
  }
}
