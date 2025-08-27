'use client'

//React Imports
import { useEffect } from 'react'

//Third Party Imports
import { useSelector } from 'react-redux'

//Redux Imports
import type { RootState } from '@features/store'

export const useReloadWarningOnProgress = () => {
  const musicProgress = useSelector((state: RootState) => state.musicProgress.uploadProgressList.length)
  const videoProgress = useSelector((state: RootState) => state.videoProgress.uploadProgressList.length)
  const plungeModelProgress = useSelector((state: RootState) => state.plungeModelProgress.uploadProgressList.length)

  const hasOngoingUpload = musicProgress > 0 || videoProgress > 0 || plungeModelProgress > 0

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasOngoingUpload) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasOngoingUpload])
}
