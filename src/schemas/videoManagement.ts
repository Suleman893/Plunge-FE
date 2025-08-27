import { z } from 'zod'

export const addVideoSchema = z.object({
  name: z
    .string()
    .nonempty('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must be at most 50 characters')
    .trim(),
  mood: z.string().nonempty('Mood selection is required'),
  playlistId: z.union([z.number(), z.null()]).refine(val => val !== null, {
    message: 'Playlist is required'
  }),
  videoInstructorId: z.union([z.number(), z.null()]).refine(val => val !== null, {
    message: 'Instructor is required'
  }),
  videoTypeId: z.union([z.number(), z.null()]).refine(val => val !== null, {
    message: 'Video type is required'
  }),
  lengthType: z.string().nonempty('Length type is required'),
  preTimerDuration: z.string().nonempty('Pretimer duration is required'),
  plungeDuration: z.string().nonempty('Plunge duration is required')
})

export type AddVideoFormValues = {
  name: string
  videoInstructorId: number | null
  mood: string
  playlistId: number | null
  videoTypeId: number | null
  lengthType: string
  preTimerDuration: string
  plungeDuration: string
}
