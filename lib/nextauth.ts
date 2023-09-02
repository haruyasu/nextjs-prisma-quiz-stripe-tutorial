import { PrismaAdapter } from "@next-auth/prisma-adapter"
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth"
import prisma from "@/lib/prisma"

import GoogleProvider from "next-auth/providers/google"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

// NextAuth設定
export const authOptions: NextAuthOptions = {
  // Prismaを使うための設定
  adapter: PrismaAdapter(prisma),

  // 認証プロバイダーの設定
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // セッションの設定
  session: {
    strategy: "jwt",
  },

  // NEXTAUTH_SECRETの設定
  secret: process.env.NEXTAUTH_SECRET,

  // Callbackの設定
  callbacks: {
    jwt: async ({ token }) => {
      const user = await prisma.user.findFirst({
        where: {
          email: token?.email,
        },
      })
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    },
  },
  // ログイン画面
  pages: {
    signIn: "login",
  },
}

export const getAuthSession = () => {
  return getServerSession(authOptions)
}
