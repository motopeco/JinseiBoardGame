const SocketEvent = {
  Auth: 'auth',
} as const

type SocketEvent = typeof SocketEvent[keyof typeof SocketEvent]

export default SocketEvent
