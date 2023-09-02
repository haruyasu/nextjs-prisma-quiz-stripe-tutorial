"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { MAX_COUNT } from "@/lib/utils"
import axios from "axios"
import QuestionLoading from "@/components/question/QuestionLoading"
import useSubscriptionModal from "@/hooks/useSubscriptionModal"
import Link from "next/link"

// 難易度
const LEVELS = ["Easy", "Normal", "Hard"] as const

// 言語
const LANGUAGES = ["Japanese", "English"] as const

// 問題数
const MIN_AMOUNT = 3
const MAX_AMOUNT = 10

// 入力データの検証ルールを定義
const schema = z.object({
  topic: z.string().min(3, { message: "3文字以上入力する必要があります。" }),
  level: z.enum(LEVELS),
  language: z.enum(LANGUAGES),
  amount: z
    .number()
    .min(MIN_AMOUNT)
    .max(MAX_AMOUNT, { message: `${MAX_AMOUNT}問まで生成できます。` }),
})

// 入力データの型を定義
type InputType = z.infer<typeof schema>

type QuizNewProps = {
  userId: string
  isSubscription: boolean
  count: number
}

// クイズ作成
const QuizNew: React.FC<QuizNewProps> = ({ userId, isSubscription, count }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const subscriptionModal = useSubscriptionModal()

  // フォームの状態
  const form = useForm<InputType>({
    // 入力値の検証
    resolver: zodResolver(schema),
    // 初期値
    defaultValues: {
      topic: "",
      level: "Easy",
      language: "Japanese",
      amount: 3,
    },
  })

  // クイズを作成
  const { mutate: newQuiz } = useMutation({
    mutationFn: async ({ topic, level, language, amount }: InputType) => {
      const response = await axios.post("/api/quiz", {
        userId,
        topic,
        level,
        language,
        amount,
      })
      return response.data
    },
  })

  // 送信
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true)

    newQuiz(data, {
      onSuccess: ({ quizId }: { quizId: string }) => {
        router.push(`/question/${quizId}`)
      },

      onError: (error: any) => {
        setLoading(false)

        if (error?.response?.status === 403) {
          // サブスクリプションモーダルを表示
          subscriptionModal.onOpen()
        } else {
          toast({
            title: "クイズの作成に失敗しました",
            description: "テーマを変更して、もう一度送信してください",
            variant: "destructive",
          })
        }
      },
    })
  }

  if (loading) {
    return <QuestionLoading />
  }

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-2xl font-bold text-center mb-5">クイズ作成</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>テーマ</FormLabel>
                <FormControl>
                  <Input placeholder="世界遺産について" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>難易度</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem value={level} key={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>言語</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem value={language} key={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>問題数</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      form.setValue("amount", parseInt(e.target.value))
                    }}
                    min={MIN_AMOUNT}
                    max={MAX_AMOUNT}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            {!isSubscription && (
              <div className="mb-2 text-sm">
                {count} / {MAX_COUNT} フリープラン
              </div>
            )}

            <Button disabled={loading} type="submit" className="w-full mb-2">
              自動生成
            </Button>

            {!isSubscription && (
              <Button
                asChild
                disabled={loading}
                variant="upgrade"
                className="w-full"
              >
                <Link href="/checkout">アップグレード</Link>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

export default QuizNew
