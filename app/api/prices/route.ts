import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET() {
  try {
    // Stripeに登録した商品情報を取得
    const prices = await stripe.prices.list({
      // 検索キーを指定
      lookup_keys: ["standard", "premium"],
      expand: ["data.product"],
    })

    return NextResponse.json({ prices: prices.data })
  } catch (error: any) {
    console.error("Stripeエラー:", error.message)
    return new NextResponse("Stripeでエラーが発生しました", { status: 500 })
  }
}
