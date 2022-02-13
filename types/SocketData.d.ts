declare namespace SocketServerData {
  // クライアントイベントのレスポンス用 --------------
  interface GetUserResult {
    uid: string
  }

  interface CreateNewRoomResult {
    isSuccess: boolean
  }

  interface JoinRoomResult {
    isSuccess: boolean
  }

  interface LeaveRoomResult {
    isSuccess: boolean
  }

  interface CommonResult {
    isSuccess: boolean
  }
  // ---------------------------------------------

  interface UserStatus {
    // status > 0 の場合、ルームID
    roomId: number
    gameData?: GameData
  }

  // ゲームプロセス
  interface ShowTurnInfoResult {
    message: string
  }

  interface HideTurnInfoResult {}

  interface ShowRouletteResult {}

  interface HideRouletteResult {}

  interface MovePieceResult {}

  interface ShowMessageResult {
    message: string
  }

  interface HideMessageResult {}
}

declare namespace SocketClientData {
  interface CreateRoomData {
    name: string
    password: string
  }

  interface JoinRoomData {
    roomId: number
  }
}
