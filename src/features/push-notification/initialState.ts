import type { PushNotificationState } from '@custom-types/features/pushNotification'

export const initialState: PushNotificationState = {
  allNotifications: null,
  isAllNotificationLoading: false,

  //Create Notification
  isCreateNotificationLoading: false,
  isCreateNotificationSuccess: false,

  //Delete Notification
  isNotificationDeleteLoading: false,
  isNotificationDeleteSuccess: false,

  //Create Notification
  isEditNotificationLoading: false,
  isEditNotificationSuccess: false
}
