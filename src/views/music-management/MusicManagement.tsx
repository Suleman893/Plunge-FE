//Components Imports
import BasicAnalytics from '@components/views/music-management/BasicAnalytics'
import SectionInfo from '@components/cards/SectionInfo'
import MusicManagementTable from '@components/views/music-management/table/MusicManagementTable'

const MusicManagement = () => {
  return (
    <div className='flex flex-col gap-6'>
      <BasicAnalytics />
      <SectionInfo title='Music Management' description='Lorem Ipsum' />
      <MusicManagementTable />
    </div>
  )
}

export default MusicManagement
