"use client"

import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

type AuthContextProps = {
  children: React.ReactNode
}

const queryClient = new QueryClient()

// 認証コンテキスト
const AuthContext = ({ children }: AuthContextProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  )
}

export default AuthContext
