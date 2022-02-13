const SocketClientEvent = {
  // 自分のユーザ情報取得
  GetUser: 'get_user',
  // ルーム作成
  CreateNewRoom: 'create_new_room',
  // ルーム参加
  JoinRoom: 'join_room',
  // ルーム退室
  LeaveRoom: 'leave_room',
  ClickStartButton: 'click_start_button',
} as const

type SocketClientEvent = typeof SocketClientEvent[keyof typeof SocketClientEvent]

export default SocketClientEvent
