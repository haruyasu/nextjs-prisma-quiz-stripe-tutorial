import { create } from "zustand"

interface ModalType {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

// サブスクリプションモーダルの状態を管理
const useSubscriptionModal = create<ModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useSubscriptionModal
