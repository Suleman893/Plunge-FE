'use client'

//React Imports
import { useState, useEffect } from 'react'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'

//Redux Imports
import { setVideoUploadProgress } from '@features/video-management/progress/slice'
import { setMusicUploadProgress } from '@features/music-management/progress/slice'
import { setPlungeModelUploadProgress } from '@features/plunge-model/progress/slice'
import type { RootState } from '@features/store'

export const useRestorePausedUploads = () => {
  const dispatch = useDispatch()
  const videoProgress = useSelector((state: RootState) => state.videoProgress.uploadProgressList)
  const musicProgress = useSelector((state: RootState) => state.musicProgress.uploadProgressList)
  const plungeProgress = useSelector((state: RootState) => state.plungeModelProgress.uploadProgressList)

  const [isRestoring, setIsRestoring] = useState(true)

  useEffect(() => {
    const pausedVideoIds = JSON.parse(localStorage.getItem('pausedVideoIds') || '[]')
    const pausedMusicIds = JSON.parse(localStorage.getItem('pausedMusicIds') || '[]')
    const pausedPlungeIds = JSON.parse(localStorage.getItem('pausedPlungeModelIds') || '[]')

    // Videos
    const toPauseVideos = pausedVideoIds
      .map((id: number) => videoProgress.find((v: any) => v?.id === id))
      .filter((v: any) => v && !v.isPaused)

    toPauseVideos.forEach((item: any) => {
      dispatch(
        setVideoUploadProgress({
          id: item.id,
          progress: item.progress,
          isPaused: true
        })
      )
    })

    // Music
    const toPauseMusics = pausedMusicIds
      .map((id: number) => musicProgress.find((m: any) => m?.id === id))
      .filter((m: any) => m && !m.isPaused)

    toPauseMusics.forEach((item: any) => {
      dispatch(
        setMusicUploadProgress({
          id: item.id,
          progress: item.progress,
          isPaused: true
        })
      )
    })

    // Plunge Models
    const toPausePlunges = pausedPlungeIds
      .map((id: number) => plungeProgress.find((p: any) => p?.id === id))
      .filter((p: any) => p)

    toPausePlunges.forEach((item: any) => {
      Object.entries(item.progress).forEach(([key, value]: [string, any]) => {
        dispatch(
          setPlungeModelUploadProgress({
            id: item.id,
            key,
            progress: value.progress,
            isPaused: true
          })
        )
      })
    })

    // Cleanup
    if (toPauseVideos.length > 0) localStorage.removeItem('pausedVideoIds')
    if (toPauseMusics.length > 0) localStorage.removeItem('pausedMusicIds')
    if (toPausePlunges.length > 0) localStorage.removeItem('pausedPlungeModelIds')

    setIsRestoring(false)
  }, [])

  return isRestoring
}
