//Components Import
import ChangePassword from '@components/views/setting/ChangePassword'
import SectionInfo from '@components/cards/SectionInfo'

const Security = () => {
  return (
    <div className='flex flex-col gap-6'>
      <SectionInfo title='Change Password' />
      <ChangePassword />
    </div>
  )
}

export default Security
