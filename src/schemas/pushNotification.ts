import { z } from 'zod'

export const addNotificationSchema = z
  .object({
    message: z
      .string()
      .nonempty('Message is required')
      .min(2, 'Message must be at least 2 characters')
      .max(120, 'Message must be at most 120 characters')
      .trim(),
    notificationType: z.string().nonempty('Type is required').trim(),
    status: z.string().nonempty('Status is required').trim(), // sent | schedule
    date: z.string().optional(),
    time: z.string().optional(),
    timeZone: z.string().optional()
  })
  .superRefine((data, ctx) => {
    // Only check for date and time when the status is 'schedule'
    if (data.status === 'schedule') {
      if (!data.date) {
        ctx.addIssue({
          path: ['date'],
          message: 'Date is required',
          code: z.ZodIssueCode.custom
        })
      }

      if (!data.time) {
        ctx.addIssue({
          path: ['time'],
          message: 'Time is required',
          code: z.ZodIssueCode.custom
        })
      }
    }
  })

export type AddNotificationFormValues = z.infer<typeof addNotificationSchema>
