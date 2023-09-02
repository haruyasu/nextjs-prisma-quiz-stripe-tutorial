import prisma from "@/lib/prisma"

// 生成回数取得
const getCount = async ({ userId }: { userId: string }) => {
  try {
    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return 0
    }

    return user.count
  } catch (error) {
    console.log(error)
    return 0
  }
}

export default getCount
