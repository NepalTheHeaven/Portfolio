import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { VideoProject } from '../types/portfolio'
import { VideoPlayer } from './VideoPlayer'

interface VideoCardProps { project: VideoProject; index: number }

export function VideoCard({ project, index }: VideoCardProps) {
  return (
    <article className="video-card" data-cursor-label="VIEW">
      <div className={`video-card-media placeholder-tone-${(index % 4) + 1}`} data-cursor-label="PLAY">
        {project.video ? <VideoPlayer src={project.video} poster={project.poster} title={project.title} compact previewOnHover /> : <div className="motion-placeholder"><span>{String(index + 1).padStart(2, '0')}</span><b>Media pending</b></div>}
        <span className="duration-chip">{project.duration}</span>
      </div>
      <div className="video-card-body">
        <div className="video-card-heading"><h2>{project.title}</h2><span>{project.category}</span></div>
        <p>{project.description}</p>
        <div className="video-card-meta"><span><CalendarDays aria-hidden="true" />{project.date}</span><span><Clock3 aria-hidden="true" />{project.duration}</span></div>
        <Link to={`/work/${project.slug}`}>View project <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </article>
  )
}
