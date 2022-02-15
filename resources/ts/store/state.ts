export interface RootState {
  auth: AuthState
  userStatus: UserStatusState
  debug: DebugState
}

export interface AuthState {
  id: number
}

export interface UserStatusState {
  roomId: number
  gameData?: GameData
}

export interface DebugState {
  events: { event: string, result: any }[]
}
