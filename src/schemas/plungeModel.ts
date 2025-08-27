import { z } from 'zod'

export const addPlungeSchema = z.object({
  tuyaId: z.union([z.number().int(), z.null()]).refine(val => val !== null, {
    message: 'Tuya Id is required'
  }),
  name: z
    .string()
    .nonempty('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 100 characters')
    .trim(),
  modelId: z
    .string()
    .nonempty('Model number/id is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 100 characters')
    .trim(),
  thumbnail: z.string().optional()

  // setupVideoUploadId: z.string().optional(),
  // pairingVideoUploadId: z.string().optional()
})

export type AddPlungeFormValues = {
  tuyaId: number | null
  name: string
  modelId: string
  thumbnail?: string

  // setupVideoUploadId?: string
  // pairingVideoUploadId?: string
}
