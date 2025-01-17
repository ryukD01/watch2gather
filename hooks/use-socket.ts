import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason)
    })

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to WebSocket server after', attemptNumber, 'attempts')
    })

    socketInstance.on('reconnect_error', (error) => {
      console.error('Failed to reconnect to WebSocket server:', error)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return socket
}

