import prisma from "@/lib/prisma"

export type QuizDataType = {
  question: string
  answer: string
  options: string
  quizId: string
}

const createQuestion = async ({ data }: { data: QuizDataType[] }) => {
  try {
    await prisma.question.createMany({
      data,
    })
  } catch (error) {
    console.log(error)
  }
}

export default createQuestion
