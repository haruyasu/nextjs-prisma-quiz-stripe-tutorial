import { getAuthSession } from "@/lib/nextauth"
import { redirect } from "next/navigation"
import Success from "@/components/subscription/Success"

// お支払い成功ページ
const SuccessPage = async () => {
  // 認証情報取得
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  return <Success userId={session.user.id} />
}

export default SuccessPage
