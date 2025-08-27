import { z } from 'zod'

export const roleSchema = z.object({
  name: z
    .string()
    .nonempty('Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(100, 'Role name must be at most 100 characters'),
  systemModuleIds: z.array(z.number()).min(1, 'Minimum one module is required')
})

export type RoleFormValue = z.infer<typeof roleSchema>
