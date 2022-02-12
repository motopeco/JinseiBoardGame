const SocketClientEvent = {
  ClickStartButton: 'click_start_button',
} as const

type SocketClientEvent = typeof SocketClientEvent[keyof typeof SocketClientEvent]

export default SocketClientEvent
