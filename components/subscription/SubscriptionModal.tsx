"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import useSubscriptionModal from "@/hooks/useSubscriptionModal"

// サブスクリプションモーダル
const SubscriptionModal = () => {
  const modal = useSubscriptionModal()

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">フリープラン終了</DialogTitle>
          <DialogDescription className="text-center">
            クイズを生成するには、プランをアップグレードしてください。
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Button
          asChild
          variant="upgrade"
          className="w-full"
          onClick={modal.onClose}
        >
          <Link href="/checkout">アップグレード</Link>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionModal
