import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AchievementBadge } from '../components/AchievementBadge'
import { GlowButton } from '../components/GlowButton'
import { PageIntro } from '../components/PageIntro'
import { PhoneMockup } from '../components/PhoneMockup'
import { ProjectNavigation } from '../components/ProjectNavigation'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { appProjects, portfolio } from '../data/portfolio'
import { usePageMeta } from '../hooks/usePageMeta'

const usableLink = (value: string) => !value.startsWith('TODO:')

export function AppDetailPage() {
  const { slug } = useParams()
  const index = appProjects.findIndex((item) => item.slug === slug)
  const project = appProjects[index]
  const navigation = useMemo(() => {
    if (index < 0) return null
    const previous = appProjects[(index - 1 + appProjects.length) % appProjects.length]
    const next = appProjects[(index + 1) % appProjects.length]
    return previous && next ? { previous, next } : null
  }, [index])
  usePageMeta({ title: project?.name ?? 'Application not found', description: project?.explanation ?? 'The requested application project does not exist.', image: project?.screenshots[0] ? `${portfolio.siteUrl}${project.screenshots[0]}` : null, structuredData: project ? { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: project.name, description: project.explanation, applicationCategory: 'MobileApplication' } : undefined })
  if (!project || !navigation) return <Navigate replace to="/apps" />

  const details = [
    ['The problem', project.problem], ['Research & observation', project.research], ['Proposed solution', project.solution],
    ['My exact contribution', project.contribution], ['Technical architecture', project.architecture], ['Challenges', project.challenges], ['Lessons learned', project.lessons],
  ]
  return (
    <article className="detail-page app-detail page-enter">
      <div className="app-detail-intro">
        <PageIntro label="Mobile application case study" title={project.name} description={project.explanation} />
        {project.isNationalWinner && <AchievementBadge />}
      </div>
      <div className="detail-facts"><span>{project.hackathonName}</span><span>{project.hackathonDate}</span><span>{project.achievement}</span></div>
      <section className="app-hero-media" id="app-demo">
        <div className="app-demo-copy"><p className="section-label">Product in motion</p><h2>Designed for a real mobile context.</h2><p>{project.solution}</p><div className="stack-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
        <PhoneMockup video={project.demoVideo} image={project.screenshots[0]} alt={`${project.name} demonstration`} />
      </section>
      <section className="detail-grid">{details.map(([title, body], i) => <Reveal key={title} className={i < 2 ? 'detail-copy featured' : 'detail-copy'}><span>{String(i + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{body}</p></Reveal>)}</section>
      <section className="feature-list"><p className="section-label">Main features</p><div>{project.features.map((feature) => <span key={feature}>{feature}</span>)}</div></section>
      <section className="screenshot-gallery" aria-label={`${project.name} screenshots`}>{project.screenshots.map((screenshot, i) => <PhoneMockup key={screenshot} image={screenshot} alt={`${project.name} screenshot ${i + 1}`} />)}</section>
      <section className="external-links"><GlowButton to={project.githubUrl} external disabled={!usableLink(project.githubUrl)}>GitHub repository</GlowButton><GlowButton to={project.demoUrl} external secondary disabled={!usableLink(project.demoUrl)}>APK / live demo</GlowButton></section>
      <section className="contact-cta"><p className="section-label">Building something useful?</p><h2>Let’s turn the idea into an experience.</h2><GlowButton to="/contact">Start a project</GlowButton></section>
      <ProjectNavigation previous={{ label: navigation.previous.name, href: `/apps/${navigation.previous.slug}` }} next={{ label: navigation.next.name, href: `/apps/${navigation.next.slug}` }} />
      <SiteFooter />
    </article>
  )
}
