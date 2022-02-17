const SocketClientEvent = {
  // 自分のユーザ情報取得
  GetUser: 'get_user',
  // ルーム作成
  CreateNewRoom: 'create_new_room',
  // ルーム参加
  JoinRoom: 'join_room',
  // ルーム退室
  LeaveRoom: 'leave_room',
  // ゲーム準備
  ReadyGame: 'ready',
  // ゲーム開始（オーナーのみ）
  StartGame: 'start',
  // ゲーム進行用（ターンのプレイヤーのみ）
  DoNextGame: 'do_next_game',
  // その他
  GetRooms: 'get_rooms',
} as const

type SocketClientEvent = typeof SocketClientEvent[keyof typeof SocketClientEvent]

export default SocketClientEvent
