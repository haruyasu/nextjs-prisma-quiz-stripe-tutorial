import { NextResponse } from "next/server"
import OpenAI from "openai"
import createQuiz from "@/actions/createQuiz"
import createQuestion, { QuizDataType } from "@/actions/createQuestion"

// OpenAI設定
const openai = new OpenAI()

// クイズの問題、解答、選択肢の生成
const functions = [
  {
    name: "Quiz",
    description: "Generate few multiple choice questions.",
    parameters: {
      type: "object",
      properties: {
        quizzes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: {
                type: "string",
                description: "question",
              },
              answer: {
                type: "string",
                description: "answer",
              },
              option1: {
                type: "string",
                description: "dummy answer",
              },
              option2: {
                type: "string",
                description: "dummy answer",
              },
              option3: {
                type: "string",
                description: "dummy answer",
              },
            },
            required: ["question", "answer", "option1", "option2", "option3"],
          },
        },
      },
      required: ["quizzes"],
    },
  },
]

type QuizType = {
  question: string
  answer: string
  option1: string
  option2: string
  option3: string
}

// クイズ生成
export async function POST(request: Request) {
  try {
    // リクエストボディの取得
    const body = await request.json()
    const { topic, level, language, amount, userId } = body

    // ChatGPT
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI that is able to generate multiple choice questions and answers.",
        },
        {
          role: "user",
          content: `Generate ${amount} random ${level} multiple choice questions about ${topic} in ${language}.`,
        },
      ],
      functions,
      function_call: {
        name: "Quiz",
      },
    })

    // メッセージ取得
    const responseMessage = response.choices[0].message

    // メッセージ取得エラー
    if (!responseMessage) {
      return new NextResponse("Message Error", { status: 404 })
    }

    // Function Callingチェック
    if (!responseMessage.function_call) {
      return new NextResponse("Function Call Error", { status: 404 })
    }

    // 引数チェック
    if (!responseMessage.function_call.arguments) {
      return new NextResponse("Function Call Arguments Error", {
        status: 500,
      })
    }

    // 引数取得
    const functionCallNameArguments = JSON.parse(
      responseMessage.function_call.arguments
    )

    // クイズ取得
    const quizzes: QuizType[] = functionCallNameArguments.quizzes

    if (quizzes.length === 0) {
      return new NextResponse("クイズが生成できませんでした", { status: 404 })
    }

    // クイズ保存
    const responseQuiz = await createQuiz({
      userId,
      topic,
      level,
      language,
      startedAt: new Date(),
    })

    // クイズ保存チェック
    if (!responseQuiz) {
      return NextResponse.json(
        { message: "クイズが保存できませんでした" },
        { status: 404 }
      )
    }

    // 選択肢をシャッフル(Fisher-Yates)
    const shuffle = <T,>(array: T[]): T[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }

    // 質問データを作成
    const quizData: QuizDataType[] = quizzes.map((quiz) => {
      const options = shuffle([
        quiz.option1,
        quiz.option2,
        quiz.option3,
        quiz.answer,
      ])

      return {
        question: quiz.question,
        answer: quiz.answer,
        options: JSON.stringify(options),
        quizId: responseQuiz.id,
      }
    })

    // 質問データを保存
    await createQuestion({ data: quizData })

    return NextResponse.json({ quizId: responseQuiz.id }, { status: 200 })
  } catch (error) {
    console.log(error)
    return new NextResponse("Error", { status: 500 })
  }
}
