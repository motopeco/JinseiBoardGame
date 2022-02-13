export interface RootState {
  auth: AuthState
  userStatus: UserStatusState
}

export interface AuthState {
  uid: string
}

export interface UserStatusState {
  status: number
  roomId: number
}
