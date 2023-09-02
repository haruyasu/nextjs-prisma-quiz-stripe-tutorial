import getQuizById from "@/actions/getQuizById"
import QuizResult from "@/components/quiz/QuizResult"
import QuestionTable from "@/components/question/QuestionTable"

type Props = {
  params: {
    quizId: string
  }
}

// クイズ詳細ページ
const QuizDetailPage = async ({ params: { quizId } }: Props) => {
  // クイズ詳細を取得
  const quiz = await getQuizById({ quizId })

  if (!quiz) {
    return <div className="text-center">クイズはありません</div>
  }

  return (
    <>
      <QuizResult quiz={quiz} />
      <QuestionTable questions={quiz.questions} />
    </>
  )
}

export default QuizDetailPage
