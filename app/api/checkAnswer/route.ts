import { NextResponse } from "next/server"
import getQuestionById from "@/actions/getQuestionById"
import updateQuestionAnswer from "@/actions/updateQuestion"

// 答え合わせ
export async function POST(req: Request) {
  try {
    // リクエストボディの取得
    const body = await req.json()
    const { questionId, userAnswer } = body

    // クイズの問題の取得
    const question = await getQuestionById({ questionId })

    // クイズの問題がない場合はエラー
    if (!question) {
      return NextResponse.json(
        { message: "クイズの問題はありません" },
        { status: 404 }
      )
    }

    // 答え合わせ
    const isCorrect = question.answer === userAnswer

    // 問題の回答と正解かを更新
    await updateQuestionAnswer({ questionId, userAnswer, isCorrect })

    // 正解を返す
    return NextResponse.json({
      answer: question.answer,
    })
  } catch (error) {
    console.log(error)
    return new NextResponse("Error", { status: 500 })
  }
}
