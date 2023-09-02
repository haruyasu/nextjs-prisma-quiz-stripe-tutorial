import prisma from "@/lib/prisma"
import Stripe from "stripe"

// サブスクリプション情報を更新
const updateSubscription = async ({
  userId,
  subscription,
  currentPeriodEnd,
}: {
  userId?: string
  subscription: Stripe.Subscription
  currentPeriodEnd?: Date
}) => {
  try {
    if (userId || subscription.metadata.userId) {
      // サブスクリプション情報を更新
      await prisma.subscription.update({
        where: {
          userId: userId || subscription.metadata.userId,
        },
        data: {
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          priceId: subscription.items.data[0].price.id,
          currentPeriodEnd,
        },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export default updateSubscription
