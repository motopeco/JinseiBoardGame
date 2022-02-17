const SocketServerEvent = {
  Auth: 'auth',
  UserStatus: 'user_status',
  UpdateRoomList: 'update_room_list',
  // game event
  ShowTurnInfo: 'show_turn_info',
  HideTurnInfo: 'hide_turn_info',
  ShowRoulette: 'show_roulette',
  UpdateRoulette: 'update_roulette',
  HideRoulette: 'hide_roulette',
  MovePiece: 'move_piece',
  ShowMessage: 'show_message',
  HideMessage: 'hide_message',
} as const

type SocketServerEvent = typeof SocketServerEvent[keyof typeof SocketServerEvent]

export default SocketServerEvent
