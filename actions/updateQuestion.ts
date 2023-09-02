import prisma from "@/lib/prisma"

const updateQuestionAnswer = async ({
  questionId,
  userAnswer,
  isCorrect,
}: {
  questionId: string
  userAnswer: string
  isCorrect: boolean
}) => {
  try {
    await prisma.question.update({
      where: { id: questionId },
      data: { userAnswer, isCorrect },
    })
  } catch (error) {
    console.log(error)
  }
}

export default updateQuestionAnswer
