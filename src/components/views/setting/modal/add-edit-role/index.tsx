'use client'

// React Imports
import { useEffect } from 'react'

//Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'

// Redux Imports
import { addRole, editRole, fetchRoleInfo } from '@features/role/thunk'
import { fetchAllModules } from '@features/module/thunk'
import type { RootState } from '@features/store'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'

// Helper Imports
import { snakeToPascalConverter } from '@helpers/common'

// Types Imports
import type { AddNewRoleProps } from '@custom-types/pages/settings/userSetting'

// Schema Imports
import type { RoleFormValue } from '@schemas/role'
import { roleSchema } from '@schemas/role'
import AllModules from './AllModule'

const AddEditRole = (props: AddNewRoleProps) => {
  const { onBtnClick, isEdit, itemData } = props

  const dispatch = useDispatch()
  const { allModules, isAllModulesLoading } = useSelector((state: RootState) => state.module)
  const { isAddRoleLoading, isEditRoleLoading } = useSelector((state: RootState) => state.role)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RoleFormValue>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      systemModuleIds: []
    }
  })

  useEffect(() => {
    dispatch(fetchAllModules() as any)

    if (isEdit && itemData?.id) {
      const payloadData = { id: itemData?.id }

      dispatch(fetchRoleInfo(payloadData) as any)
    }
  }, [isEdit, itemData?.id])

  useEffect(() => {
    if (isEdit && itemData?.id) {
      const formattedName = itemData?.name && snakeToPascalConverter(itemData?.name)

      setValue('name', formattedName || '')
      setValue('systemModuleIds', itemData?.systemModules?.map((module: any) => module.id) || [])
    }
  }, [isEdit, itemData?.id, setValue])

  const selectedIds = watch('systemModuleIds')
  const moduleIds = allModules.map((mod: any) => mod.id)
  const isAllSelected = moduleIds.length > 0 && selectedIds.length === moduleIds.length

  const handleToggleAll = () => {
    setValue('systemModuleIds', isAllSelected ? [] : moduleIds)
  }

  const toggleModule = (id: number) => {
    const newIds = selectedIds.includes(id) ? selectedIds.filter(mid => mid !== id) : [...selectedIds, id]

    setValue('systemModuleIds', newIds)
  }

  const onSubmit = (data: RoleFormValue) => {
    if (isEdit) {
      return dispatch(editRole({ id: itemData?.id, data, onBtnClick }) as any)
    }

    dispatch(addRole({ data, onBtnClick }) as any)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className='flex flex-col gap-6'>
        <div className='overflow-visible flex flex-col gap-6 pbs-0 sm:pli-16'>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Role Name'
                fullWidth
                variant='outlined'
                placeholder='Enter Role Name'
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <AllModules
            allModules={allModules}
            selectedIds={selectedIds}
            isLoading={isAllModulesLoading}
            onToggleAll={handleToggleAll}
            onToggleModule={toggleModule}
            error={errors.systemModuleIds?.message}
          />
        </div>
        <div className='flex gap-5 mx-auto'>
          <BorderButton text='Cancel' handleClick={onBtnClick} />
          <CustomButton
            type='submit'
            text={isEdit ? 'Edit Role' : 'Add Role'}
            loading={isAddRoleLoading || isEditRoleLoading}
          />
        </div>
      </div>
    </form>
  )
}

export default AddEditRole
