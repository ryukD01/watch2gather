'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CreateRoom } from '@/components/create-room'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Play, Users } from 'lucide-react'

interface Room {
  _id: string
  name: string
  hostId: {
    name: string
  }
  participants: string[]
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms')
      if (!res.ok) throw new Error('Failed to fetch rooms')
      const data = await res.json()
      setRooms(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Watch2gether Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Watch Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <p className="text-muted-foreground">No rooms available. Create one to get started!</p>
              ) : (
                <ul className="space-y-2">
                  {rooms.map((room) => (
                    <li key={room._id}>
                      <Card>
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{room.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Hosted by {room.hostId.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {room.participants.length}
                            </span>
                            <Link href={`/room/${room._id}`}>
                              <Button size="sm">
                                <Play className="w-4 h-4 mr-2" />
                                Join
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CreateRoom />
        </motion.div>
      </div>
    </div>
  )
}

