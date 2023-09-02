import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import createSubscription from "@/actions/createSubscription"
import getSubscription from "@/actions/getSubscription"
import updateSubscription from "@/actions/updateSubscription"

interface CustomInvoice extends Stripe.Invoice {
  payment_intent: Stripe.PaymentIntent
}

interface CustomSubscription extends Stripe.Subscription {
  latest_invoice: CustomInvoice
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディからユーザーID、価格ID、名前、メールアドレスを取得
    const { userId, priceId, name, email } = await request.json()

    // Stripeから顧客IDを検索
    const search = await stripe.customers.search({
      query: `metadata['userId']:'${userId}'`,
    })

    let customerId

    if (search.data.length > 0) {
      // 顧客ID取得
      customerId = search.data[0].id
    } else {
      // 顧客ID作成
      const customer = await stripe.customers.create({
        name,
        email,
        metadata: {
          userId,
        },
      })
      customerId = customer.id
    }

    // サブスクリプション作成
    const subscription = (await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId,
      },
    })) as CustomSubscription

    // ユーザーのサブスクリプション情報を取得
    const userSubscription = await getSubscription({ userId })

    if (userSubscription) {
      // サブスクリプション更新
      await updateSubscription({
        subscription,
      })
    } else {
      // サブスクリプション保存
      await createSubscription({
        userId,
        subscription,
      })
    }

    // クライアントシークレットを返す
    return NextResponse.json({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    })
  } catch (error: any) {
    console.error("Stripeエラー:", error.message)
    return new NextResponse("Stripeでエラーが発生しました", { status: 500 })
  }
}
