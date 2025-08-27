import { z } from 'zod'

export const editProfileSchema = z.object({
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
    .or(z.literal(''))
})

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .nonempty('Current Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  newPassword: z
    .string()
    .nonempty('New Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().nonempty('Confirm Password is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
