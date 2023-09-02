"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Question, Quiz } from "@prisma/client"
import { differenceInSeconds } from "date-fns"
import { formatTimeDelta } from "@/lib/utils"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import Image from "next/image"

type QuizResultProps = {
  quiz: Quiz & { questions: Pick<Question, "isCorrect">[] }
}

// クイズ結果
const QuizResult: React.FC<QuizResultProps> = ({ quiz }) => {
  // 正解数を取得
  const correct = quiz.questions.reduce((acc, question) => {
    if (question.isCorrect) {
      return acc + 1
    }
    return acc
  }, 0)

  // スコア計算
  let score = (correct / quiz.questions.length) * 100
  score = Math.round(score)

  // 不正解数を取得
  const incorrect = quiz.questions.length - correct

  // 経過時間を取得
  const time = formatTimeDelta(
    differenceInSeconds(
      new Date(quiz.finishedAt ?? 0),
      new Date(quiz.startedAt ?? 0)
    )
  )

  // トロフィー画像
  let imageSrc = ""
  if (score > 75) {
    imageSrc = "/gold.png"
  } else if (score > 50) {
    imageSrc = "/silver.png"
  } else {
    imageSrc = "/bronze.png"
  }

  return (
    <div>
      <div className="text-center font-bold text-2xl mb-5">結果</div>

      <div className="text-center mb-5">
        <div className="text-gray-500 text-sm">スコア</div>
        <div className="text-xl font-bold">{score}/100</div>
      </div>

      <div className="flex items-center justify-center mb-5">
        <div className="relative h-[100px] w-[100px]">
          <Image src={imageSrc} className="object-cover" alt="tropy" fill />
        </div>
      </div>

      <Card className="shadow-none">
        <CardHeader className="grid grid-cols-4">
          <div className="text-center">
            <div className="text-gray-500 text-sm">テーマ</div>
            <div className="text-lg font-bold">{quiz.topic}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-sm">回答時間</div>
            <div className="text-lg font-bold">{time}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-sm">難易度</div>
            <div className="text-lg font-bold">{quiz.level}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-sm">言語</div>
            <div className="text-lg font-bold">{quiz.language}</div>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center bg-green-200 rounded-lg font-bold text-xl text-green-600 py-5">
            <CheckCircledIcon className="w-5 h-5 mr-1" />
            {correct}
          </div>

          <div className="flex items-center justify-center bg-red-200 rounded-lg font-bold text-xl text-red-600 py-5">
            <CrossCircledIcon className="w-5 h-5 mr-1" />
            {incorrect}
          </div>

          <div className="text-gray-500 text-sm text-center">正解</div>
          <div className="text-gray-500 text-sm text-center">不正解</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuizResult
