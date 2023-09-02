import getQuizzes from "@/actions/getQuizzes"
import QuizItem from "@/components/quiz/QuizItem"

//トップページ
const Home = async () => {
  // クイズ一覧を取得
  const quizzes = await getQuizzes()

  if (quizzes.length === 0) {
    return <div className="text-center">クイズはありません</div>
  }

  return (
    <div className="space-y-2">
      {quizzes.map((quiz) => {
        return <QuizItem key={quiz.id} quiz={quiz} />
      })}
    </div>
  )
}

export default Home
