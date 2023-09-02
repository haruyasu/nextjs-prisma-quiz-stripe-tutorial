import { getAuthSession } from "@/lib/nextauth"
import { redirect } from "next/navigation"
import PaymentDetail from "@/components/subscription/PaymentDetail"

type Props = {
  params: {
    clientSecret: string
  }
}

// お支払い画面
const PaymentDetailPage = async ({ params: { clientSecret } }: Props) => {
  // 認証情報取得
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <PaymentDetail
      clientSecret={clientSecret}
      name={session.user.name!}
      email={session.user.email!}
    />
  )
}

export default PaymentDetailPage
