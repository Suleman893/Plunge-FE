import { z } from 'zod'

export const addMusicSchema = z.object({
  name: z
    .string()
    .nonempty('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must be at most 50 characters')
    .trim(),
  artistName: z
    .string()
    .nonempty('Artist name is required')
    .min(2, 'Artist name must be at least 2 characters')
    .max(50, 'Artist name must be at most 50 characters'),
  playlistId: z.union([z.number(), z.null()]).refine(val => val !== null, {
    message: 'Playlist is required'
  }),
  licenseTypeId: z.union([z.number(), z.null()]).refine(val => val !== null, {
    message: 'License type is required'
  })
})

export type AddMusicFormValues = {
  name: string
  artistName: string
  playlistId: number | null
  licenseTypeId: number | null
}
