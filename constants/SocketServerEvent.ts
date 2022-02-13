const SocketServerEvent = {
  Auth: 'auth',
  CreateNewRoomSuccess: 'create_new_room_success',
} as const

type SocketServerEvent = typeof SocketServerEvent[keyof typeof SocketServerEvent]

export default SocketServerEvent
