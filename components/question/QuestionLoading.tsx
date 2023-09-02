"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// クイズ作成中のローディング
const QuestionLoading = () => {
  return (
    <div>
      <h1 className="text-center font-bold mb-5">クイズ生成中...</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="w-[100px] h-[30px]" />
          </CardTitle>
        </CardHeader>

        <Separator className="mb-5" />

        <CardContent>
          <div className="font-bold text-2xl mb-5">
            <Skeleton className="w-[300px] h-[30px]" />
          </div>

          {[1, 2, 3, 4].map((index) => {
            return (
              <div key={index}>
                <Skeleton className="w-full h-[30px] mb-2" />
              </div>
            )
          })}
        </CardContent>

        <Separator className="mb-5" />

        <CardFooter className="justify-between">
          <Skeleton className="w-[100px] h-[30px]" />
        </CardFooter>
      </Card>
    </div>
  )
}

export default QuestionLoading
