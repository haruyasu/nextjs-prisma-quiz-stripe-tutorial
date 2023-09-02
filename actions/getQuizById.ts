import prisma from "@/lib/prisma"

const getQuizById = async ({ quizId }: { quizId: string }) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        user: { select: { name: true, image: true } },
      },
    })

    if (!quiz) {
      return null
    }

    return quiz
  } catch (error) {
    return null
  }
}

export default getQuizById
