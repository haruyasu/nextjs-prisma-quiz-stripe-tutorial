"use client"

import { Button } from "@/components/ui/button"
import { type Session } from "next-auth"
import UserNavigation from "@/components/auth/UserNavigation"
import Link from "next/link"

type NavigationProps = {
  session: Session | null
  isSubscription: boolean
}

// ナビゲーション
const Navigation: React.FC<NavigationProps> = ({ session, isSubscription }) => {
  return (
    <header className="shadow-lg shadow-gray-100 mb-10">
      <div className="container mx-auto flex max-w-screen-md items-center justify-between px-2 py-3">
        <Link href="/" className="cursor-pointer text-xl font-bold">
          FullStackChannel
        </Link>

        {session?.user ? (
          <div className="flex items-center justify-center space-x-5">
            {!isSubscription && (
              <Button asChild variant="upgrade">
                <Link href="/checkout">アップグレード</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/quiz/new">クイズ作成</Link>
            </Button>
            <UserNavigation user={session.user} />
          </div>
        ) : (
          <Button asChild>
            <Link href="/login">ログイン</Link>
          </Button>
        )}
      </div>
    </header>
  )
}

export default Navigation
