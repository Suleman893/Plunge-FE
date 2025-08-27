import { z } from 'zod'

export const addUserSchema = z.object({
  firstName: z
    .string()
    .nonempty('First name is required')
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  email: z.string().nonempty('Email is required').email('Email is invalid').trim(),
  roleId: z.union([z.number().int(), z.null()]).refine(val => val !== null, {
    message: 'Role is required'
  })
})

export const inviteFormSchema = z
  .object({
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(32, 'Password must be at most 32 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[\W_]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().nonempty('Confirm Password is required'),
    email: z.string().nonempty('Email is required').email('Email is invalid').trim(),
    firstName: z
      .string()
      .nonempty('First name is required')
      .trim()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be at most 50 characters'),
    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be at most 50 characters')
      .optional()
      .or(z.literal(''))
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  })

export const editUserDetailSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .nonempty('First name is required'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  photo: z.string().nullable(),
  phone: z
    .string()
    .trim()
    .min(8, 'Phone number must be at least 8 characters')
    .max(15, 'Phone number must be at most 15 characters')
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .trim()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .trim()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  roleId: z
    .number()
    .int()
    .nullable()
    .refine(val => val !== null, {
      message: 'Role is required'
    })
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  inform: z.boolean()
})

export type InviteFormValues = z.infer<typeof inviteFormSchema>
export type AddUserFormValues = {
  firstName: string
  lastName?: string
  email: string
  roleId: number | null
}
export type EditUserDetailFormValues = {
  firstName: string
  lastName?: string
  photo: string | null
  phone?: string
  country?: string
  state?: string
  roleId: number | null
}
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
