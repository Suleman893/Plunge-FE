//Components Imports
import PushNotificationTable from '@components/views/push-notification/table/PushNotificationTable'
import SectionInfo from '@components/cards/SectionInfo'

const PushNotification = () => {
  return (
    <div className='flex flex-col gap-6'>
      <SectionInfo title='Push Notifications History' description='Lorem Ipsum' />
      <PushNotificationTable />
    </div>
  )
}

export default PushNotification
