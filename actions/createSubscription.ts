import prisma from "@/lib/prisma"
import Stripe from "stripe"

// サブスクリプション保存
const createSubscription = async ({
  userId,
  subscription,
  currentPeriodEnd,
}: {
  userId: string
  subscription: Stripe.Subscription
  currentPeriodEnd?: Date
}) => {
  try {
    // サブスクリプション情報を保存
    await prisma.subscription.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

export default createSubscription
