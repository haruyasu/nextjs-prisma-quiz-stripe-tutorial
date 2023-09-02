"use client"

import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import Stripe from "stripe"

type CheckoutProps = {
  isSubscription: boolean
  userId: string
  name: string
  email: string
}

// 構築済みの決済
const Checkout: React.FC<CheckoutProps> = ({
  isSubscription,
  userId,
  name,
  email,
}) => {
  const { toast } = useToast()
  const [prices, setPrices] = useState<Stripe.Price[]>([])

  // 商品リスト取得
  const { mutate: getPrices, isLoading: loadingPrices } = useMutation({
    mutationFn: async () => {
      const response = await axios.get("/api/prices")
      return response.data
    },
  })

  // サブスクリプション作成
  const { mutate: checkout, isLoading: loadingCheckout } = useMutation({
    mutationFn: async ({ priceId }: { priceId: string }) => {
      const response = await axios.post("/api/checkout", {
        userId,
        name,
        email,
        priceId,
      })
      return response.data
    },
  })

  // カスタマーポータル
  const { mutate: billingPortal, isLoading: loadingBillingPortal } =
    useMutation({
      mutationFn: async () => {
        const response = await axios.post("/api/billingPortal", {
          userId,
        })
        return response.data
      },
    })

  // 商品リスト取得
  useEffect(() => {
    const fetchPrices = async () => {
      getPrices(undefined, {
        onSuccess: ({ prices }) => {
          setPrices(prices)
        },

        onError: (error) => {
          console.log(error)
          toast({
            title: "商品の取得に失敗しました",
            description: "お手数おかけしますが、お問い合わせください",
            variant: "destructive",
          })
        },
      })
    }
    fetchPrices()
  }, [getPrices, toast])

  // 申し込むボタンクリック
  const handleCheckout = async (priceId: string) => {
    checkout(
      { priceId },
      {
        onSuccess: ({ url }) => {
          // チェックアウト画面に遷移
          window.location.href = url
        },

        onError: (error) => {
          console.log(error)
          toast({
            title: "サブスクリプション作成に失敗しました",
            description: "お手数おかけしますが、お問い合わせください",
            variant: "destructive",
          })
        },
      }
    )
  }

  // 決済内容確認ボタンクリック
  const handleBillingPortal = async () => {
    billingPortal(undefined, {
      onSuccess: ({ url }) => {
        // カスタマーポータルに遷移
        window.location.href = url
      },

      onError: (error) => {
        console.log(error)
        toast({
          title: "決済内容の確認に失敗しました",
          description: "お手数おかけしますが、お問い合わせください",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <div>
      {isSubscription ? (
        <div>
          <div className="text-2xl font-bold text-center mb-5">
            サブスクリプション
          </div>
          <div className="max-w-[500px] mx-auto">
            <Card>
              <CardHeader>
                <CardDescription className="text-center">
                  サブスクリプションに申し込み中です
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button
                  className="w-full"
                  variant="default"
                  onClick={handleBillingPortal}
                  disabled={loadingBillingPortal}
                >
                  決済内容確認
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-sm text-center mb-2 text-gray-500">
            構築済み決済ページ
          </div>
          <div className="text-2xl font-bold text-center mb-1">
            プランのアップグレード
          </div>
          <div className="text-center text-sm mb-5 text-gray-500">
            いつでもキャンセル可能
          </div>

          {loadingPrices && (
            <div className="text-center my-5 text-sm">プラン取得中...</div>
          )}

          <div className="grid grid-cols-2 gap-5">
            {prices.map((price) => {
              return (
                <Card key={price.id}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">
                      {(price.product as Stripe.Product).name}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {(price.product as Stripe.Product).description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-2xl text-center">
                      ¥{price.unit_amount!.toLocaleString()} / 月
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant="upgrade"
                      onClick={() => handleCheckout(price.id)}
                      disabled={loadingCheckout}
                    >
                      申し込む
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
