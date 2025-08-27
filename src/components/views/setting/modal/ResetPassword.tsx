'use client'

//React Imports
import { useState } from 'react'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

//Schema Imports
import { resetPasswordSchema, type ResetPasswordFormValues } from '@schemas/users'

//Component Imports
import ResetPass from '@components/modal/shared/ResetPass'

//Types import
import type { PasswordMethod, ResetPasswordProps } from '@custom-types/pages/settings/userSetting'

//Redux Imports
import { lastPasswordChange } from '@features/user/thunk'
import { resetPassword } from '@features/users/thunk'
import type { RootState } from '@features/store'

//Helpers Import
import { generatePassword } from '@helpers/common'

const ResetPassword = (props: ResetPasswordProps) => {
  const { itemData, onBtnClick } = props

  const dispatch = useDispatch()

  const { isResetPasswordLoading } = useSelector((state: RootState) => state.users)

  //States
  const [passwordMethod, setPasswordMethod] = useState<PasswordMethod>('default')

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: generatePassword(),
      inform: false
    }
  })

  const handlePasswordMethodChange = (e: any) => {
    const method = e.target.value

    setPasswordMethod(method)

    if (method === 'custom') {
      setValue('password', '')
    }

    if (method === 'default') {
      const generatedPassword = generatePassword()

      clearErrors('password')
      setValue('password', generatedPassword)
    }
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    const payloadData = {
      uid: itemData?.uid,
      data,
      onBtnClick
    }

    const res = await dispatch(resetPassword(payloadData) as any)

    if (res?.meta?.requestStatus === 'fulfilled') {
      dispatch(lastPasswordChange({ uid: itemData?.uid }) as any)
    }
  }

  return (
    <ResetPass
      passwordMethod={passwordMethod}
      loading={isResetPasswordLoading}
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      handlePasswordMethodChange={handlePasswordMethodChange}
      onBtnClick={onBtnClick}
      errors={errors}
    />
  )
}

export default ResetPassword
