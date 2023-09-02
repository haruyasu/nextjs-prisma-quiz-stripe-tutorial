import { MAX_COUNT } from "@/lib/utils"
import prisma from "@/lib/prisma"

// クイズ生成回数チェック
const checkCount = async ({ userId }: { userId: string }) => {
  try {
    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    // 無料生成回数が残っている場合
    if (!user || user.count < MAX_COUNT) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export default checkCount
