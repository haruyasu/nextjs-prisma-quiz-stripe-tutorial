import prisma from "@/lib/prisma"

// クイズ生成回数更新
const updateCount = async ({ userId }: { userId: string }) => {
  try {
    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (user) {
      // 生成回数を更新
      await prisma.user.update({
        where: { id: userId },
        data: { count: user.count + 1 },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export default updateCount
