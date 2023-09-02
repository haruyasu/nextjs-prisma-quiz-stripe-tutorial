import { getAuthSession } from "@/lib/nextauth"
import { redirect } from "next/navigation"
import Payment from "@/components/subscription/Payment"
import checkSubscription from "@/actions/checkSubscription"

// カスタムの決済フロー
// https://stripe.com/docs/payments/quickstart

// 商品選択ページ
const PaymentPage = async () => {
  // 認証情報取得
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  // サブスクリプション有効チェック
  const isSubscription = await checkSubscription({ userId: session.user.id })

  return (
    <Payment
      isSubscription={isSubscription}
      userId={session.user.id}
      name={session.user.name!}
      email={session.user.email!}
    />
  )
}

export default PaymentPage
