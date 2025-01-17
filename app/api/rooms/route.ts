import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/utils'
import { Room } from '@/models/room'
import { authOptions } from '@/auth/[...nextauth]/route'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { name, videoUrl } = await req.json()
    await connectToDatabase()

    const room = await Room.create({
      name,
      videoUrl,
      hostId: session.user.id,
      participants: [session.user.id],
    })

    return NextResponse.json({ roomId: room._id }, { status: 201 })
  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const rooms = await Room.find({
      participants: session.user.id,
    }).populate('hostId', 'name')

    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Get rooms error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

