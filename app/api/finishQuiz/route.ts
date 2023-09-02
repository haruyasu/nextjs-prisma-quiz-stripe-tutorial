import { NextResponse } from "next/server"
import getQuizById from "@/actions/getQuizById"
import updateQuiz from "@/actions/updateQuiz"

// クイズ終了
export async function POST(req: Request) {
  try {
    // リクエストボディの取得
    const body = await req.json()
    const { quizId } = body

    // クイズの取得
    const quiz = await getQuizById({ quizId })

    if (!quiz) {
      return NextResponse.json(
        { message: "クイズはありません" },
        { status: 404 }
      )
    }

    if (!quiz.finishedAt) {
      // クイズの終了時間を更新
      await updateQuiz({ quizId, finishedAt: new Date() })
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.log(error)
    return new NextResponse("Error", { status: 500 })
  }
}
