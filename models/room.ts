import mongoose from 'mongoose'

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema)

