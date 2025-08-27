'use client'

//React Imports
import { useEffect, useRef } from 'react'

//Third Party Imports
// eslint-disable-next-line
import Hls from 'hls.js'

//Component Imports
import BorderButton from '@components/buttons/BorderButton'

//Types Imports
import type { AudioPlayerProps } from '@custom-types/pages/music-management'

const AudioPlayer = (props: AudioPlayerProps) => {
  const { item, handleClose } = props

  //Ref
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!item?.audio || !audioRef.current) return

    const audio = audioRef.current

    // If Mux HLS stream (.m3u8), use hls.js if browser doesn't support it
    if (item?.audio?.includes('.m3u8')) {
      if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = item.audio
      }

      // Fallback to hls.js for unsupported browsers
      else if (Hls.isSupported()) {
        const hls = new Hls()

        hls.loadSource(item?.audio)
        hls.attachMedia(audioRef.current)

        return () => {
          hls.destroy()
        }
      }
    } else {
      audio.src = item?.audio
    }
  }, [item?.audio])

  return (
    <div className='flex flex-col items-center gap-5'>
      <div>
        <p className='text-center font-bold'>Currently Playing:</p>
        <span className='text-black'>{item?.name} | </span>
        <span className='font-extralight'>{item?.artistName}</span>
      </div>
      <div className='w-full'>
        <audio
          ref={audioRef}
          className='w-full'
          autoPlay
          controls
          controlsList='nodownload noplaybackrate noremoteplayback'
        />
      </div>
      <BorderButton text='Close' handleClick={handleClose} />
    </div>
  )
}

export default AudioPlayer
