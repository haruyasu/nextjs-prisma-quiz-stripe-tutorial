import prisma from "@/lib/prisma"

const updateQuiz = async ({
  quizId,
  finishedAt,
}: {
  quizId: string
  finishedAt: Date
}) => {
  try {
    await prisma.quiz.update({
      where: { id: quizId },
      data: { finishedAt },
    })
  } catch (error) {
    console.log(error)
  }
}

export default updateQuiz
