"use client"

import {
  useStripe,
  useElements,
  LinkAuthenticationElement,
  PaymentElement,
} from "@stripe/react-stripe-js"
import { useState } from "react"
import { Button } from "@/components/ui/button"

type PaymentFormProps = {
  name: string
  email: string
}

// カスタム決済フォーム
const PaymentForm: React.FC<PaymentFormProps> = ({ name, email }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // 送信
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Stripeが読み込まれているか確認
    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    // 決済を確定
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      },
    })

    // エラーがあればメッセージを表示
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(
        error.message || "エラーが発生しました。内容をご確認ください。"
      )
    } else {
      setMessage("エラーが発生しました。内容をご確認ください。")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <LinkAuthenticationElement
        options={{
          defaultValues: {
            email,
          },
        }}
      />
      <PaymentElement
        options={{
          defaultValues: {
            billingDetails: {
              name,
              email,
            },
          },
          layout: "tabs",
        }}
      />

      <Button disabled={loading || !stripe || !elements} className="w-full">
        決済する
      </Button>

      {message && <div className="text-center text-red-500">{message}</div>}
    </form>
  )
}

export default PaymentForm
