//Components Imports
import MostRecent from '@/components/views/dashboard/MostRecent'
import BasicAnalytics from '@components/views/dashboard/BasicAnalytics'
import DashboardTable from '@components/views/dashboard/table/DashboardTable'

const Dashboard = () => {
  return (
    <div className='flex flex-col gap-8'>
      <BasicAnalytics />
      <MostRecent />
      <DashboardTable />
    </div>
  )
}

export default Dashboard
