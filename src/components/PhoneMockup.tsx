import { VideoPlayer } from './VideoPlayer'

interface PhoneMockupProps { image?: string; video?: string; alt: string; className?: string }

export function PhoneMockup({ image, video, alt, className = '' }: PhoneMockupProps) {
  return (
    <div className={`phone-mockup ${className}`.trim()}>
      <span className="phone-speaker" aria-hidden="true" />
      <div className="phone-screen">
        {video ? <VideoPlayer src={video} title={alt} compact /> : image ? <img src={image} alt={alt} loading="lazy" /> : <div className="media-placeholder">TODO<br />Add media</div>}
      </div>
    </div>
  )
}
