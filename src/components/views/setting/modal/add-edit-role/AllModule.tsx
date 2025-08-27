'use client'

//MUI Imports
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

//Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'

//Component Imports
import ModalLoader from '@components/loaders/ModalLoader'
import tableStyles from '@core/styles/table.module.css'

//Types Imports
import type { AllModulesProps } from '@custom-types/pages/settings/userSetting'

const AllModules = (props: AllModulesProps) => {
  const { allModules, selectedIds, isLoading, onToggleAll, onToggleModule, error } = props

  const moduleIds = allModules.map(mod => mod.id)
  const isAllSelected = moduleIds.length > 0 && selectedIds.length === moduleIds.length
  const isIndeterminate = selectedIds.length > 0 && !isAllSelected

  return (
    <>
      <Typography variant='h5' className='min-is-[225px]'>
        Role Permissions
      </Typography>
      {isLoading ? (
        <ModalLoader />
      ) : (
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <tbody>
              {allModules.length === 0 ? (
                <tr>
                  <td colSpan={2}>
                    <Typography className='text-center py-4' color='text.secondary'>
                      No modules available for role permission
                    </Typography>
                  </td>
                </tr>
              ) : (
                <>
                  <tr className='border-bs-0'>
                    <th className='pis-0'>
                      <Typography className='font-medium text-left min-is-[225px]' color='text.primary'>
                        Full Access
                      </Typography>
                    </th>
                    <th className='!text-end pie-0'>
                      <FormControlLabel
                        className='mie-0 capitalize'
                        control={
                          <Checkbox onChange={onToggleAll} indeterminate={isIndeterminate} checked={isAllSelected} />
                        }
                        label='Select All'
                      />
                    </th>
                  </tr>
                  {allModules.map(mod => (
                    <tr key={mod.id} className='border-be '>
                      <td className='pis-0'>
                        <Typography className='font-medium min-is-[225px]' color='text.primary'>
                          {snakeToPascalConverter(mod.name)}
                        </Typography>
                      </td>
                      <td className='!text-end pie-0'>
                        <FormControlLabel
                          control={
                            <Checkbox checked={selectedIds.includes(mod.id)} onChange={() => onToggleModule(mod.id)} />
                          }
                          label={<Typography className='text-sm'>Allow Access</Typography>}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          {error && (
            <Typography color='error.main' variant='body2' className='mt-2'>
              {error}
            </Typography>
          )}
        </div>
      )}
    </>
  )
}

export default AllModules
