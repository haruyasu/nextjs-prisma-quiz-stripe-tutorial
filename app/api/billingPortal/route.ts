import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import getSubscription from "@/actions/getSubscription"

// リダイレクト先のURLを設定
const return_url = `${process.env.NEXT_PUBLIC_APP_URL}`

export async function POST(request: Request) {
  try {
    // リクエストボディからユーザーIDを取得
    const { userId } = await request.json()

    // ユーザーのサブスクリプション情報を取得
    const subscription = await getSubscription({ userId })

    // サブスクリプションが存在しない場合
    if (!subscription || !subscription.customerId) {
      return new NextResponse("サブスクリプションが取得できませんでした", {
        status: 400,
      })
    }

    // カスタマーポータルセッションを作成
    const billingPortal = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url,
    })

    // カスタマーポータルのURLをレスポンスとして返す
    return new NextResponse(JSON.stringify({ url: billingPortal.url }))
  } catch (error: any) {
    console.error("Stripeエラー:", error.message)
    return new NextResponse("Stripeでエラーが発生しました", { status: 500 })
  }
}
