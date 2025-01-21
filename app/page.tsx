import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
      <h1 className="text-4xl font-bold mb-6">Welcome to Watch2gether</h1>
      <p className="text-xl mb-8 text-center max-w-md">
        Watch videos with friends in real-time, chat, and enjoy a shared experience!
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}

