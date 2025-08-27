// 'use client'

// // React Imports
// import { useEffect, useRef } from 'react'

// // Third Party Imports
// import { useSelector } from 'react-redux'

// // Redux Imports
// import { type RootState } from '@features/store'

// export const useWarnAndPauseUploadsOnUnload = () => {
//   const musicProgress = useSelector((state: RootState) => state.musicProgress.uploadProgressList)
//   const videoProgress = useSelector((state: RootState) => state.videoProgress.uploadProgressList)
//   const plungeModelProgress = useSelector((state: RootState) => state.plungeModelProgress.uploadProgressList)

//   // Refs to hold latest state
//   const videoRef = useRef(videoProgress)
//   const musicRef = useRef(musicProgress)
//   const plungeRef = useRef(plungeModelProgress)

//   useEffect(() => {
//     videoRef.current = videoProgress
//     musicRef.current = musicProgress
//     plungeRef.current = plungeModelProgress
//   }, [videoProgress, musicProgress, plungeModelProgress])

//   useEffect(() => {
//     const saveBeforeUnload = () => {
//       const pausedVideoIds = videoRef.current.filter((i: any) => !i.isPaused).map((i: any) => i.id)
//       const pausedMusicIds = musicRef.current.filter((i: any) => !i.isPaused).map((i: any) => i.id)

//       const pausedPlungeIds = plungeRef.current
//         .filter((item: any) => Object.values(item.progress || {}).some((v: any) => !v.isPaused))
//         .map((item: any) => item.id)

//       localStorage.setItem('pausedVideoIds', JSON.stringify(pausedVideoIds))
//       localStorage.setItem('pausedMusicIds', JSON.stringify(pausedMusicIds))
//       localStorage.setItem('pausedPlungeModelIds', JSON.stringify(pausedPlungeIds))
//     }

//     const handleBeforeUnload = (event: BeforeUnloadEvent) => {
//       const hasOngoingUpload =
//         videoRef.current.some((item: any) => !item.isPaused) ||
//         musicRef.current.some((item: any) => !item.isPaused) ||
//         plungeRef.current.some((item: any) => Object.values(item.progress || {}).some((v: any) => !v.isPaused))

//       if (hasOngoingUpload) {
//         event.preventDefault()
//         event.returnValue = ''
//         window.addEventListener('unload', saveBeforeUnload)

//         return ''
//       }
//     }

//     window.addEventListener('beforeunload', handleBeforeUnload)

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload)
//       window.removeEventListener('unload', saveBeforeUnload)
//     }
//   }, []) // only attach once on mount
// }
