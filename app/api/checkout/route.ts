import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
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

    // チェックアウトセッション作成
    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    })

    // チェックアウトセッションのURLをレスポンスとして返す
    return new NextResponse(JSON.stringify({ url: checkoutSession.url }))
  } catch (error: any) {
    console.error("Stripeエラー:", error.message)
    return new NextResponse("Stripeでエラーが発生しました", { status: 500 })
  }
}
