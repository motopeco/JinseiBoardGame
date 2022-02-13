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
  // ---------------------------------------------

  interface UserStatus {
    // status > 0 の場合、ルームID
    roomId: number
    gameData?: GameData
  }
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