import { z } from 'zod'

export const editUserSchema = z.object({
  photo: z.union([z.string(), z.null()]).optional(),
  dob: z.string().trim().nonempty('Date of Birth is required'),
  gender: z.string().nonempty('Gender is required')
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

export type EditUserFormValues = z.infer<typeof editUserSchema>

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
