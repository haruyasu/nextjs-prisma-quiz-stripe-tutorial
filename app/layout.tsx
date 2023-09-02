import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { getAuthSession } from "@/lib/nextauth"
import { Toaster } from "@/components/ui/toaster"

import Navigation from "@/components/auth/Navigation"
import AuthContext from "@/app/context/AuthContext"
import ModalProvider from "@/components/subscription/ModalProvider"
import checkSubscription from "@/actions/checkSubscription"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "クイズアプリ",
  description: "クイズアプリ",
}

// レイアウト
const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // 認証情報取得
  const session = await getAuthSession()

  // サブスクリプション有効チェック
  const isSubscription = await checkSubscription({ userId: session?.user.id })

  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthContext>
          <div className="flex min-h-screen flex-col">
            <Navigation session={session} isSubscription={isSubscription} />
            <Toaster />
            <ModalProvider />

            <main className="container mx-auto max-w-screen-md flex-1 px-2">
              {children}
            </main>

            {/* フッター */}
            <footer className="py-5">
              <div className="text-center text-sm">
                Copyright © All rights reserved | FullStackChannel
              </div>
            </footer>
          </div>
        </AuthContext>
      </body>
    </html>
  )
}

export default RootLayout
