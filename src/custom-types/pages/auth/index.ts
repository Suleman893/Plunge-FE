//Third Party Imports
import type { Control, FieldErrors } from 'react-hook-form'

//Schema Imports
import type { InviteFormValues } from '@schemas/users'

//OobCode (Firebase)
export type OobCodeType = string | null

//modeType (Firebase)
export type ModeType = string | null

//Invite Screen
export type UidType = string | null

//Invite Screen
export type ExpiryType = string | null

//Invite Screen
export type EmailType = string | null

export interface ResetPassFormProps {
  oobCode: OobCodeType
}

export interface InviteProps {
  expiry: ExpiryType
}

export interface AddPasswordFormProps {
  control: Control<InviteFormValues>
  errors: FieldErrors<InviteFormValues>
  onNext: () => void
}

export interface SetupProfileFormProps {
  control: Control<InviteFormValues>
  errors: FieldErrors<InviteFormValues>
  onNext: () => void
}
