'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSocket } from '@/hooks/use-socket'
import { Users, Send } from 'lucide-react'

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

interface ChatMessage {
  userId: string
  message: string
}

export default function RoomPage() {
  const { id } = useParams()
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null)
  const [users, setUsers] = useState<string[]>([])
  const [videoTime, setVideoTime] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const socket = useSocket()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!socket) return

    socket.emit('join-room', id)

    socket.on('user-joined', (userId: string) => {
      setUsers(prev => [...prev, userId])
    })

    socket.on('user-left', (userId: string) => {
      setUsers(prev => prev.filter(id => id !== userId))
    })

    socket.on('video-time-update', (time: number) => {
      if (videoRef.current && Math.abs(videoRef.current.currentTime - time) > 1) {
        videoRef.current.currentTime = time
      }
    })

    socket.on('chat-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message])
    })

    return () => {
      socket.emit('leave-room', id)
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('video-time-update')
      socket.off('chat-message')
    }
  }, [socket, id])

  const startVideoCall = async () => {
    try {
      await client.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        id as string,
        null,
        null
      )

      const videoTrack = await AgoraRTC.createCameraVideoTrack()
      setLocalVideoTrack(videoTrack)
      await client.publish(videoTrack)
    } catch (error) {
      console.error('Error joining video call:', error)
    }
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      socket?.emit('video-time-update', id, time)
    }
  }

  const handleSendMessage = () => {
    if (messageInput.trim() && socket) {
      socket.emit('chat-message', id, messageInput.trim())
      setMessageInput('')
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <Card className="lg:col-span-2 p-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src="/placeholder.mp4"
              controls
              className="w-full h-full"
              onTimeUpdate={handleVideoTimeUpdate}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Participants</h2>
            <Button onClick={startVideoCall} size="sm">
              <Users className="mr-2 h-4 w-4" />
              Join Video
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {localVideoTrack && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={(ref) => ref && localVideoTrack.play(ref)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {users.map((userId) => (
              <div
                key={userId}
                className="aspect-video bg-muted rounded-lg overflow-hidden"
              >
                {/* Remote video will be played here */}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Chat</h3>
            <div className="h-[200px] bg-muted rounded-lg p-2 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{msg.userId === socket?.id ? 'You' : 'User'}:</span> {msg.message}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

