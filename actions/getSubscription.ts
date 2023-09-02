import prisma from "@/lib/prisma"

// サブスクリプション取得
const getSubscription = async ({ userId }: { userId: string | undefined }) => {
  try {
    // サブスクリプション情報を取得
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    })

    return subscription
  } catch (error) {
    return null
  }
}

export default getSubscription
