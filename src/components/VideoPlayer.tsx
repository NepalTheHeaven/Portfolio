import { useEffect, useId, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'

const PLAY_EVENT = 'portfolio-video-play'

interface VideoPlayerProps { src?: string; poster?: string; title: string; compact?: boolean; previewOnHover?: boolean }

export function VideoPlayer({ src, poster, title, compact = false, previewOnHover = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const id = useId()
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const pauseOther = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      if (customEvent.detail !== id) video.pause()
    }
    const onPause = () => setPlaying(false)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) video.pause()
    }, { threshold: .18 })
    window.addEventListener(PLAY_EVENT, pauseOther)
    video.addEventListener('pause', onPause)
    observer.observe(video)
    return () => {
      window.removeEventListener(PLAY_EVENT, pauseOther)
      video.removeEventListener('pause', onPause)
      observer.disconnect()
      video.pause()
    }
  }, [id])

  const play = async () => {
    const video = videoRef.current
    if (!video) return
    window.dispatchEvent(new CustomEvent<string>(PLAY_EVENT, { detail: id }))
    try { await video.play(); setPlaying(true) } catch { setPlaying(false) }
  }

  const togglePlayback = () => playing ? videoRef.current?.pause() : void play()
  const replay = () => { if (!videoRef.current) return; videoRef.current.currentTime = 0; void play() }
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !muted
    setMuted(video.muted)
  }
  const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

  if (!src || error) {
    return <div className={`video-shell media-placeholder ${compact ? 'is-compact' : ''}`}>TODO<br />Add actual video</div>
  }

  return (
    <div
      className={`video-shell ${compact ? 'is-compact' : ''}`}
      data-cursor-label="PLAY"
      onMouseEnter={() => { if (previewOnHover && canHover()) void play() }}
      onMouseLeave={() => { if (previewOnHover && canHover()) videoRef.current?.pause() }}
    >
      <video ref={videoRef} src={src} poster={poster} preload="metadata" muted={muted} playsInline aria-label={title} onError={() => setError(true)} onEnded={() => setPlaying(false)} />
      <div className="video-controls">
        <button type="button" onClick={togglePlayback} aria-label={playing ? `Pause ${title}` : `Play ${title}`}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" fill="currentColor" />}</button>
        {!compact && <button type="button" onClick={replay} aria-label={`Replay ${title}`}><RotateCcw aria-hidden="true" /></button>}
        <button type="button" onClick={toggleMute} aria-label={muted ? `Unmute ${title}` : `Mute ${title}`}>{muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}</button>
      </div>
    </div>
  )
}
