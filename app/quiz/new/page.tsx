import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/nextauth"
import QuizNew from "@/components/quiz/QuizNew"

// 新規クイズ作成ページ
const QuizNewPage = async () => {
  // 認証情報取得
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  return <QuizNew userId={session.user.id} />
}

export default QuizNewPage
