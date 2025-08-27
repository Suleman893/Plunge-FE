import type { PushNotification } from '@custom-types/features/pushNotification'

export interface NotificationDetailProps {
  onBtnClick: () => void
  isEdit: boolean
  defaultData: PushNotification | null
  onEditBtnClick: () => void
}

export interface AddEditNotificationProps {
  isEdit?: boolean
  handleClose: () => void
  defaultData?: PushNotification | null
}

export interface PushNotificationFiltersProps {
  page: number
  setPage: (page: number) => void
  filters: any
  setFilters: (arg: any) => void
}
