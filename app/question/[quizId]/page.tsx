import { getAuthSession } from "@/lib/nextauth"
import { redirect } from "next/navigation"

import getQuizById from "@/actions/getQuizById"
import Question from "@/components/question/Question"

type Props = {
  params: {
    quizId: string
  }
}

// クイズ問題ページ
const QuestionPage = async ({ params: { quizId } }: Props) => {
  // 認証情報取得
  const session = await getAuthSession()

  if (!session?.user) {
    return redirect("/login")
  }

  // クイズ詳細取得
  const quiz = await getQuizById({ quizId })

  if (!quiz) {
    return <div className="text-center">クイズはありません</div>
  }

  return <Question quiz={quiz} />
}

export default QuestionPage
