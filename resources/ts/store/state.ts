import { DateTime } from 'luxon'

export interface RootState {
  auth: AuthState
  userStatus: UserStatusState
  debug: DebugState
  lobby: LobbyState
}

export interface AuthState {
  id: number
}

export interface UserStatusState {
  roomId: number
  gameData?: GameData
}

export interface DebugState {
  events: { event: string; result: any }[]
}

export interface LobbyState {
  rooms: {
    id: number
    name: string
    gameData: GameData
    createdAt: DateTime
    updatedAt: DateTime
  }[]
}
