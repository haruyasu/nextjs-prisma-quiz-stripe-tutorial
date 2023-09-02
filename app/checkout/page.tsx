import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/nextauth"
import checkSubscription from "@/actions/checkSubscription"
import Checkout from "@/components/subscription/Checkout"

// 構築済みの決済ページフロー
// https://stripe.com/docs/checkout/quickstart?client=next

// 商品選択ページ
const CheckoutPage = async () => {
  // 認証情報取得
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  // サブスクリプション有効チェック
  const isSubscription = await checkSubscription({ userId: session.user.id })

  return (
    <Checkout
      isSubscription={isSubscription}
      userId={session.user.id}
      name={session.user.name!}
      email={session.user.email!}
    />
  )
}

export default CheckoutPage
