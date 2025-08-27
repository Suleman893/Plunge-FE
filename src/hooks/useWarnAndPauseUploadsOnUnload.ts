'use client'

//React Imports
import { useEffect } from 'react'

//Third Party Imports
import { useSelector } from 'react-redux'

//Redux Imports
import { type RootState } from '@features/store'

export const useWarnAndPauseUploadsOnUnload = () => {
  const musicProgress = useSelector((state: RootState) => state.musicProgress.uploadProgressList)
  const videoProgress = useSelector((state: RootState) => state.videoProgress.uploadProgressList)
  const plungeModelProgress = useSelector((state: RootState) => state.plungeModelProgress.uploadProgressList)

  const hasOngoingUpload =
    videoProgress.some((item: any) => !item.isPaused) ||
    musicProgress.some((item: any) => !item.isPaused) ||
    plungeModelProgress.some((item: any) => Object.values(item.progress || {}).some((v: any) => !v.isPaused))

  useEffect(() => {
    const saveBeforeUnload = () => {
      const pausedVideoIds = videoProgress.filter((i: any) => !i.isPaused).map((i: any) => i.id)
      const pausedMusicIds = musicProgress.filter((i: any) => !i.isPaused).map((i: any) => i.id)

      const pausedPlungeIds = plungeModelProgress
        .filter((item: any) => Object.values(item.progress || {}).some((v: any) => !v.isPaused))
        .map((item: any) => item.id)

      localStorage.setItem('pausedVideoIds', JSON.stringify(pausedVideoIds))
      localStorage.setItem('pausedMusicIds', JSON.stringify(pausedMusicIds))
      localStorage.setItem('pausedPlungeModelIds', JSON.stringify(pausedPlungeIds))
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasOngoingUpload) {
        event.preventDefault()
        event.returnValue = ''

        // Attach the unload event to save just before unload actually happens
        window.addEventListener('unload', saveBeforeUnload)

        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', saveBeforeUnload)
    }
  }, [hasOngoingUpload, videoProgress, musicProgress, plungeModelProgress])
}
