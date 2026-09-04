import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import gsap from 'gsap'
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'

interface BeforeAfterVideoProps {
  beforeVideo: string; afterVideo: string; poster?: string; title: string; description?: string; beforeLabel?: string; afterLabel?: string; orientation?: 'vertical' | 'wide'
}

export function BeforeAfterVideo({ beforeVideo, afterVideo, poster, title, description, beforeLabel = 'Before', afterLabel = 'After', orientation = 'vertical' }: BeforeAfterVideoProps) {
  const beforeRef = useRef<HTMLVideoElement>(null)
  const afterRef = useRef<HTMLVideoElement>(null)
  const demoRef = useRef({ value: 50 })
  const touchedRef = useRef(false)
  const syncingRef = useRef(false)
  const [position, setPosition] = useState(50)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.timeline({ delay: .8 }).to(demoRef.current, { value: 64, duration: .65, ease: 'power2.inOut', onUpdate: () => { if (!touchedRef.current) setPosition(demoRef.current.value) } }).to(demoRef.current, { value: 50, duration: .65, ease: 'power2.inOut', onUpdate: () => { if (!touchedRef.current) setPosition(demoRef.current.value) } })
    return () => { tween.kill() }
  }, [])

  useEffect(() => () => { beforeRef.current?.pause(); afterRef.current?.pause() }, [])

  const announceInteraction = () => { touchedRef.current = true; gsap.killTweensOf(demoRef.current) }
  const updatePosition = (event: ChangeEvent<HTMLInputElement>) => { announceInteraction(); setPosition(Number(event.target.value)) }
  const syncTime = (source: HTMLVideoElement, target: HTMLVideoElement) => {
    if (syncingRef.current || Math.abs(source.currentTime - target.currentTime) < .12) return
    syncingRef.current = true
    target.currentTime = source.currentTime
    requestAnimationFrame(() => { syncingRef.current = false })
  }
  const playBoth = async () => {
    if (!beforeRef.current || !afterRef.current) return
    try { await Promise.all([beforeRef.current.play(), afterRef.current.play()]); setPlaying(true) } catch { setPlaying(false) }
  }
  const togglePlayback = () => {
    announceInteraction()
    if (playing) { beforeRef.current?.pause(); afterRef.current?.pause(); setPlaying(false) } else { void playBoth() }
  }
  const toggleMute = () => {
    announceInteraction()
    const next = !muted
    if (beforeRef.current) beforeRef.current.muted = next
    if (afterRef.current) afterRef.current.muted = next
    setMuted(next)
  }
  const replay = () => {
    announceInteraction()
    if (beforeRef.current) beforeRef.current.currentTime = 0
    if (afterRef.current) afterRef.current.currentTime = 0
    void playBoth()
  }

  return (
    <figure className={`before-after-block orientation-${orientation}`}>
      <div className="before-after-frame" style={{ '--comparison-position': `${position}%` } as React.CSSProperties}>
        {!ready && <div className="comparison-loading">Loading comparison…</div>}
        <video ref={beforeRef} src={beforeVideo} poster={poster} preload="metadata" muted={muted} playsInline aria-label={`${title} — ${beforeLabel}`} onLoadedData={() => setReady(true)} onTimeUpdate={() => { if (beforeRef.current && afterRef.current) syncTime(beforeRef.current, afterRef.current) }} onPause={() => { if (!syncingRef.current) { afterRef.current?.pause(); setPlaying(false) } }} />
        <div className="after-layer"><video ref={afterRef} src={afterVideo} poster={poster} preload="metadata" muted={muted} playsInline aria-label={`${title} — ${afterLabel}`} onTimeUpdate={() => { if (afterRef.current && beforeRef.current) syncTime(afterRef.current, beforeRef.current) }} onPause={() => { if (!syncingRef.current) beforeRef.current?.pause() }} /></div>
        <span className="comparison-label label-before">{beforeLabel}</span><span className="comparison-label label-after">{afterLabel}</span>
        <div className="comparison-line" aria-hidden="true"><span>‹ ›</span></div>
        <input className="comparison-range" type="range" min="0" max="100" value={position} onChange={updatePosition} onPointerDown={announceInteraction} data-cursor-label="DRAG" aria-label={`Reveal ${afterLabel}; currently ${Math.round(position)} percent`} />
        <div className="comparison-controls">
          <button type="button" onClick={togglePlayback} aria-label={playing ? 'Pause both videos' : 'Play both videos'}>{playing ? <Pause /> : <Play fill="currentColor" />}</button>
          <button type="button" onClick={replay} aria-label="Replay comparison"><RotateCcw /></button>
          <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute comparison' : 'Mute comparison'}>{muted ? <VolumeX /> : <Volume2 />}</button>
        </div>
      </div>
      <div className="comparison-mobile-toggle"><button type="button" onClick={() => { announceInteraction(); setPosition(0) }}>{beforeLabel}</button><button type="button" onClick={() => { announceInteraction(); setPosition(100) }}>{afterLabel}</button></div>
      {(title || description) && <figcaption><strong>{title}</strong>{description && <p>{description}</p>}</figcaption>}
    </figure>
  )
}
