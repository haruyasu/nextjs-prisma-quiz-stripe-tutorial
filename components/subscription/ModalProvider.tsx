"use client"

import { useEffect, useState } from "react"
import SubscriptionModal from "@/components/subscription/SubscriptionModal"

// モーダルプロバイダー
const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <SubscriptionModal />
}

export default ModalProvider
