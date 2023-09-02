import { LanguageType, LevelType } from "@prisma/client"
import { Quiz } from "@prisma/client"
import prisma from "@/lib/prisma"

const createQuiz = async ({
  userId,
  topic,
  level,
  language,
  startedAt,
}: {
  userId: string
  topic: string
  level: LevelType
  language: LanguageType
  startedAt: Date
}): Promise<Quiz | null> => {
  try {
    const quizzes = await prisma.quiz.create({
      data: {
        userId,
        topic,
        level,
        language,
        startedAt,
      },
    })

    return quizzes
  } catch (error) {
    console.log(error)
    return null
  }
}

export default createQuiz
