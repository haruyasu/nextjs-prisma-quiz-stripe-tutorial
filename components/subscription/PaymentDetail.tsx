"use client"

import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import PaymentForm from "@/components/subscription/PaymentForm"

// Stripeの公開鍵を読み込む
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

type PaymentDetailProps = {
  clientSecret: string
  name: string
  email: string
}

// お支払い
const PaymentDetail: React.FC<PaymentDetailProps> = ({
  clientSecret,
  name,
  email,
}) => {
  const options: StripeElementsOptions = {
    clientSecret,
    // https://stripe.com/docs/elements/appearance-api
    appearance: {
      // テーマを指定
      theme: "stripe",
      // カスタマイズ
      variables: {
        borderRadius: "8px",
      },
    },
  }

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-center font-bold mb-5 text-xl">
        クレジットカードでのお支払い
      </div>
      <Elements options={options} stripe={stripePromise}>
        <PaymentForm name={name} email={email} />
      </Elements>
    </div>
  )
}

export default PaymentDetail
