//Components Imports
import SettingTabSection from '@components/views/setting/TabSec'
import SettingHeader from '@components/views/setting/SettingHeader'

const Page = () => {
  return (
    <div className='flex flex-col gap-6'>
      <SettingHeader />
      <SettingTabSection />
    </div>
  )
}

export default Page
