import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import createSubscription from "@/actions/createSubscription"
import updateSubscription from "@/actions/updateSubscription"
import getSubscription from "@/actions/getSubscription"

// Stripe Webhook Secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  // リクエストのボディをテキストとして取得
  const body = await req.text()

  // Stripeのシグネチャをヘッダーから取得
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  // StripeのWebhookシグネチャを検証
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (error: any) {
    // シグネチャの検証に失敗した場合
    return new NextResponse(`Webhookにエラーが発生しました: ${error.message}`, {
      status: 400,
    })
  }

  // イベントデータからセッション情報を取得
  const session = event.data.object as Stripe.Checkout.Session

  let subscription: Stripe.Subscription

  // イベントタイプに応じて異なる処理を実行
  switch (event.type) {
    // 最初の支払いが成功したとき
    case "checkout.session.completed":
      console.log("checkout.session.completed")
      const userId = session?.metadata?.userId

      // ユーザーIDが存在しない場合はエラーレスポンスを返す
      if (!userId) {
        return new NextResponse("ユーザーIDが存在しません", { status: 400 })
      }

      // Stripeからサブスクリプションの詳細を取得
      subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      // ユーザーのサブスクリプション情報を取得
      const userSubscription = await getSubscription({ userId })

      if (userSubscription) {
        // サブスクリプション更新
        await updateSubscription({
          userId,
          subscription,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        })
      } else {
        // サブスクリプション保存
        await createSubscription({
          userId,
          subscription,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        })
      }

      break
    // 定期的な支払いが成功したとき
    case "invoice.payment_succeeded":
      console.log("invoice.payment_succeeded")
      // Stripeからサブスクリプションの詳細を取得
      subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      // サブスクリプション更新
      await updateSubscription({
        subscription,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
      break
  }

  return new NextResponse("OK", { status: 200 })
}
