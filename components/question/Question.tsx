"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Quiz, Question } from "@prisma/client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { differenceInSeconds } from "date-fns"
import { formatTimeDelta } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import {
  CheckCircledIcon,
  CrossCircledIcon,
  LapTimerIcon,
} from "@radix-ui/react-icons"
import { type VariantProps } from "class-variance-authority"
import axios from "axios"
import exp from "constants"

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]

type QuestionProps = {
  quiz: Quiz & { questions: Question[] }
}

// クイズ問題
const Question: React.FC<QuestionProps> = ({ quiz }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [questionNumber, setQuestionNumber] = useState<number>(0)
  const [selectAnswer, setSelectAnswer] = useState<string>("")
  const [answer, setAnswer] = useState<string>("")
  const [now, setNow] = useState<Date | null>(null)

  // 現在の問題
  const currentQuestion = useMemo(() => {
    return quiz.questions[questionNumber]
  }, [questionNumber, quiz.questions])

  // 選択肢設定
  const options = useMemo(() => {
    if (!currentQuestion) return []
    if (!currentQuestion.options) return []
    return JSON.parse(currentQuestion.options as string) as string[]
  }, [currentQuestion])

  // 回答時間
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // 答え合わせ
  const { mutate: checkAnswer, isLoading: loadingCheckAnswer } = useMutation({
    mutationFn: async (index: number) => {
      const response = await axios.post(`/api/checkAnswer`, {
        questionId: currentQuestion.id,
        userAnswer: options[index],
      })
      return response.data
    },
  })

  // クイズ終了
  const { mutate: finishQuiz } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/finishQuiz`, {
        quizId: quiz.id,
      })
    },
  })

  // 次の問題へ
  const handleNext = useCallback(() => {
    // 選択リセット
    setSelectAnswer("")
    // 解答リセット
    setAnswer("")

    // 最後の問題だったら終了
    if (questionNumber === quiz.questions.length - 1) {
      // クイズ終了
      finishQuiz(undefined, {
        onSuccess: () => {
          // 結果画面へ
          router.push(`/quiz/${quiz.id}`)

          // キャッシュクリア
          router.refresh()
        },
      })
    } else {
      // 次の問題へ
      setQuestionNumber((questionNumber) => questionNumber + 1)
    }
  }, [questionNumber, quiz.questions.length, finishQuiz, quiz.id, router])

  // 回答
  const handleAnswer = useCallback(
    (index: number, option: string) => {
      // 選択肢を設定
      setSelectAnswer(option)

      // 答え合わせ
      checkAnswer(index, {
        onSuccess: ({ answer }) => {
          // 解答を設定
          setAnswer(answer)
        },

        onError: (error) => {
          console.error(error)
          toast({
            title: "答え合わせに失敗しました",
            description: "もう一度お試しください",
            variant: "destructive",
          })
        },
      })
    },
    [checkAnswer, toast]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>{quiz.topic}</div>
          {now && (
            <div className="flex items-center space-x-2 font-normal text-sm">
              <LapTimerIcon className="h-5 w-5" />
              <div className="w-[90px]">
                {formatTimeDelta(differenceInSeconds(now, quiz.startedAt))}
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <Separator className="mb-5" />

      <CardContent>
        <div className="font-bold text-2xl mb-5">
          {questionNumber + 1}. {currentQuestion?.question}
        </div>

        {options.map((option, index) => {
          let variantValue: ButtonVariant = "outline"
          let IconComponent = null

          // 答え合わせ時に表示を変更
          if (selectAnswer) {
            if (loadingCheckAnswer) {
              variantValue = "secondary"
            } else if (answer) {
              if (answer === option) {
                variantValue = "correct"
                IconComponent = CheckCircledIcon
              } else if (selectAnswer === option) {
                variantValue = "incorrect"
                IconComponent = CrossCircledIcon
              }
            }
          }

          return (
            <div key={index}>
              <Button
                onClick={() => handleAnswer(index, option)}
                disabled={!!selectAnswer || loadingCheckAnswer}
                variant={variantValue}
                className="justify-between w-full py-5 mb-2 shadow-none disabled:opacity-100"
              >
                {option}
                {IconComponent && (
                  <IconComponent
                    className={`w-5 h-5 ${
                      variantValue === "correct"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  />
                )}
              </Button>
            </div>
          )
        })}
      </CardContent>

      <Separator className="mb-5" />

      <CardFooter className="justify-between">
        <div>
          {questionNumber + 1} of {quiz.questions.length} Questions
        </div>
        {selectAnswer && !loadingCheckAnswer && (
          <div>
            <Button onClick={handleNext}>
              {quiz.questions.length === questionNumber + 1
                ? "結果発表"
                : "次の問題へ"}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default Question
