export interface RootState {
  auth: AuthState
  userStatus: UserStatusState
}

export interface AuthState {
  id: number
}

export interface UserStatusState {
  roomId: number
  gameData?: GameData
}
