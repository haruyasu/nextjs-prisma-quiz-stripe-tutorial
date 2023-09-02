import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/nextauth"
import checkSubscription from "@/actions/checkSubscription"
import QuizNew from "@/components/quiz/QuizNew"
import getCount from "@/actions/getCount"

// 新規クイズ作成ページ
const QuizNewPage = async () => {
  // 認証情報取得
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  // サブスクリプション有効確認
  const isSubscription = await checkSubscription({ userId: session.user.id })
  // クイズ生成回数取得
  const count = await getCount({ userId: session.user.id })

  return (
    <QuizNew
      userId={session.user.id}
      isSubscription={isSubscription}
      count={count}
    />
  )
}

export default QuizNewPage
