//Components Imports
import BasicAnalytics from '@components/views/video-management/BasicAnalytics'
import SectionInfo from '@components/cards/SectionInfo'
import VideoManagementTable from '@components/views/video-management/table/VideoManagementTable'

const VideoManagement = () => {
  return (
    <div className='flex flex-col gap-6'>
      <BasicAnalytics />
      <SectionInfo
        title='Video Management'
        description='Manage video sessions for the mobile app by adding or removing content with ease.'
      />
      <VideoManagementTable />
    </div>
  )
}

export default VideoManagement
