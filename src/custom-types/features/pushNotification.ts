export interface PushNotification {
  id: number
  notificationType: any
  message: string
  sent: string
  status: string
  date: any
  time: any
}

export interface PushNotificationState {
  allNotifications: any
  isAllNotificationLoading: boolean

  //Create Notification
  isCreateNotificationLoading: boolean
  isCreateNotificationSuccess: boolean

  //Delete Notification
  isNotificationDeleteLoading: boolean
  isNotificationDeleteSuccess: boolean

  //Edit Notification
  isEditNotificationLoading: boolean
  isEditNotificationSuccess: boolean
}
