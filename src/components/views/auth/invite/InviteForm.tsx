'use client'

//React Imports
import { useState } from 'react'

//Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

//Third Party Imports
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'

//Components Imports
import AddPasswordForm from '@components/views/auth/invite/AddPasswordForm'
import SetupProfileForm from '@components/views/auth/invite/SetupProfileForm'

//Schema Imports
import { setProfileDefault } from '@constants/formDefault/users'
import type { InviteFormValues } from '@schemas/users'
import { inviteFormSchema } from '@schemas/users'

//Type Imports
import type { UidType, EmailType } from '@custom-types/pages/auth'

//Redux Imports
import { activateInvitedUser } from '@features/users/thunk'

const InviteForm = () => {
  //Hooks
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  //UID from URL
  const uid: UidType = searchParams.get('uid')

  //States
  const [CurrentForm, setCurrentForm] = useState(() => AddPasswordForm)

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<InviteFormValues>({
    defaultValues: setProfileDefault,
    resolver: zodResolver(inviteFormSchema)
  })

  const onSubmit = async (data: InviteFormValues) => {
    const payloadData = {
      uid,
      router,
      data
    }

    dispatch(activateInvitedUser(payloadData) as any)
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <CurrentForm
        control={control}
        errors={errors}
        onNext={async () => {
          const isStepValid = await trigger(['password', 'confirmPassword'])

          if (isStepValid) {
            const emailParam = searchParams.get('email')

            const email: EmailType = decodeURIComponent(String(emailParam))

            if (email) setValue('email', email)
            setCurrentForm(() => SetupProfileForm)
          }
        }}
      />
    </form>
  )
}

export default InviteForm
