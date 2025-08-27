//React Imports
import { useState } from 'react'

//Types Imports
import type { ModalConfig } from '@custom-types/components/modals'

export const useModalOpener = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null)

  const openModal = (config: ModalConfig) => {
    setModalConfig(config)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)

    // Small delay to allow animations to complete before clearing config
    setTimeout(() => setModalConfig(null), 100)
  }

  return {
    isOpen,
    openModal,
    closeModal,
    modalConfig
  }
}
