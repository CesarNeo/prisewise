import mongoose from 'mongoose'

let isConnected = false

export async function connectToDatabase() {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URI) {
    return console.error('MONGODB_URI environment variable is not set')
  }

  if (isConnected) {
    return console.log('=> using existing database connection')
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)

    isConnected = true

    console.log('=> MongoDB connected')
  } catch (error) {
    console.error(error)
  }
}
