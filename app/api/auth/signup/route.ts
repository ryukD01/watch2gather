import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/db"
import { User } from "@/models/user"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    await connectToDatabase()

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Add test user
export async function GET() {
  try {
    await connectToDatabase()

    const testEmail = "test@gmail.com"
    const testPassword = "test"

    // Check if test user already exists
    const existingUser = await User.findOne({ email: testEmail })
    if (existingUser) {
      return NextResponse.json({ message: "Test user already exists" }, { status: 200 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 12)

    // Create test user
    await User.create({
      name: "Test User",
      email: testEmail,
      password: hashedPassword,
    })

    return NextResponse.json({ message: "Test user created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Create test user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

