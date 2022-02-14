/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import Ws from 'App/Services/Ws'
import Room from 'App/Models/Room'
import UserStatus = SocketServerData.UserStatus
import SocketServerEvent from '../constants/SocketServerEvent'

Event.on('notification', async (roomId) => {
  const room = await Room.getRoom(roomId)
  if (!room) return

  const data: UserStatus = {
    roomId: Number(room.id),
    gameData: room.gameData,
  }

  Ws.io.to(`room${room.id}`).emit(SocketServerEvent.UserStatus, data)
})
