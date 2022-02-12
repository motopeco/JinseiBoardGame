const SocketServerEvent = {
  Auth: 'auth',
} as const

type SocketServerEvent = typeof SocketServerEvent[keyof typeof SocketServerEvent]

export default SocketServerEvent
