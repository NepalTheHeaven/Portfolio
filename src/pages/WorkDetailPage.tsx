import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { BeforeAfterVideo } from '../components/BeforeAfterVideo'
import { GlowButton } from '../components/GlowButton'
import { PageIntro } from '../components/PageIntro'
import { ProjectNavigation } from '../components/ProjectNavigation'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { VideoPlayer } from '../components/VideoPlayer'
import { portfolio, videoProjects } from '../data/portfolio'
import { usePageMeta } from '../hooks/usePageMeta'

export function WorkDetailPage() {
  const { slug } = useParams()
  const index = videoProjects.findIndex((item) => item.slug === slug)
  const project = videoProjects[index]
  const navigation = useMemo(() => {
    if (index < 0) return null
    const previous = videoProjects[(index - 1 + videoProjects.length) % videoProjects.length]
    const next = videoProjects[(index + 1) % videoProjects.length]
    return previous && next ? { previous, next } : null
  }, [index])
  usePageMeta({ title: project?.title ?? 'Project not found', description: project?.description ?? 'The requested video project does not exist.', image: project?.poster ? `${portfolio.siteUrl}${project.poster}` : null })
  if (!project || !navigation) return <Navigate replace to="/work" />

  const details = [
    ['Objective', project.objective], ['Context', project.context], ['Editing approach', project.editingApproach],
    ['Colour grading', project.colourApproach], ['Sound design', project.soundApproach], ['Motion & VFX', project.motionApproach],
    ['Challenges', project.challenges], ['Final result', project.result],
  ]

  return (
    <article className="detail-page page-enter">
      <PageIntro label={`Video project / ${project.category}`} title={project.title} description={project.description} />
      <div className="detail-facts"><span>{project.date}</span><span>{project.duration}</span><span>{project.tools.join(' / ')}</span></div>
      <Reveal className="detail-media">
        {project.video ? <VideoPlayer src={project.video} poster={project.poster} title={project.title} /> : project.beforeAfter ? <BeforeAfterVideo {...project.beforeAfter} title={project.title} /> : <div className="wide-placeholder">TODO: Add final edited video</div>}
      </Reveal>
      <section className="detail-grid">{details.map(([title, body], i) => <Reveal key={title} className={i < 2 ? 'detail-copy featured' : 'detail-copy'}><span>{String(i + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{body}</p></Reveal>)}</section>
      <section className="contact-cta"><p className="section-label">Have a story to shape?</p><h2>Let’s make the next frame matter.</h2><GlowButton to="/contact">Start a project</GlowButton></section>
      <ProjectNavigation previous={{ label: navigation.previous.title, href: `/work/${navigation.previous.slug}` }} next={{ label: navigation.next.title, href: `/work/${navigation.next.slug}` }} />
      <SiteFooter />
    </article>
  )
}
