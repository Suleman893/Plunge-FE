//Components Imports
import BasicAnalytics from '@components/views/plunge-model/BasicAnalytics'
import SectionInfo from '@components/cards/SectionInfo'
import PlungeModelTable from '@components/views/plunge-model/table/PlungeModelTable'

const PlungeModel = () => {
  return (
    <div className='flex flex-col gap-6'>
      <BasicAnalytics />
      <SectionInfo title='Plunge Models' description='Add Model by syncing the tuya hardware to show into the app' />
      <PlungeModelTable />
    </div>
  )
}

export default PlungeModel
