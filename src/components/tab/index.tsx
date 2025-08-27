'use client'

//React Imports
import type { SyntheticEvent } from 'react'
import { useState, cloneElement } from 'react'

//MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

//Component Imports
import CustomTabList from '@core/components/mui/TabList'

//Types Imports
import type { TabsViewProps } from '@custom-types/components/tabs'

const TabsView = (props: TabsViewProps) => {
  const { initialActive, viewList, options } = props
  const [activeTab, setActiveTab] = useState(initialActive)

  const handleChange = (_event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
            {options.map((itm, idx) => {
              return (
                <Tab
                  key={idx}
                  label={itm.label}
                  icon={cloneElement(activeTab === itm.value ? itm.activeIcon : itm.defaultIcon)}
                  iconPosition={itm.iconPosition}
                  value={itm.value}
                  disabled={itm.disabled}
                  sx={{ gap: 2 }}
                />
              )
            })}
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value={activeTab} className='p-0'>
            {viewList[activeTab]}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default TabsView
