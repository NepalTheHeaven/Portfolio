import { Play, Smartphone } from 'lucide-react'
import { AchievementBadge } from '../components/AchievementBadge'
import { GlowButton } from '../components/GlowButton'
import { PageIntro } from '../components/PageIntro'
import { PhoneMockup } from '../components/PhoneMockup'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { appProjects } from '../data/portfolio'
import { usePageMeta } from '../hooks/usePageMeta'
import { Link } from 'react-router-dom'

export function AppsPage() {
  usePageMeta({ title: 'Products with Purpose', description: 'Mobile application projects built by Nabin Paudel, including a national-level hackathon winning project.' })
  return (
    <div className="apps-page page-enter">
      <PageIntro label="03 / Mobile applications" title="Products with" accent="Purpose" align="center" description="Two hackathon products. Different problems, one commitment to useful and carefully made experiences." />
      <div className="apps-grid">
        {appProjects.map((project, index) => (
          <Reveal key={project.slug}>
            <article className="app-card">
              {project.isNationalWinner && <AchievementBadge />}
              <div className="app-card-copy">
                <p className="project-index">Project {String(index + 1).padStart(2, '0')}</p>
                <h2>{project.name}</h2><p className="app-explanation">{project.explanation}</p>
                <dl><div><dt>Problem</dt><dd>{project.problem}</dd></div><div><dt>Solution</dt><dd>{project.solution}</dd></div></dl>
              </div>
              <div className="app-phones" aria-label={`${project.name} application preview`}>
                <PhoneMockup image={project.screenshots[0]} alt={`${project.name} interface, screen one`} />
                <PhoneMockup image={project.screenshots[3] ?? project.screenshots[1]} alt={`${project.name} interface, screen two`} className="phone-secondary" />
              </div>
              <div className="app-card-footer">
                <div><span>My role</span><strong>{project.contribution}</strong><small><Smartphone aria-hidden="true" />{project.technologies.join(' / ')}</small></div>
                <div className="app-card-actions">
                  {project.demoVideo ? <Link className="button button-secondary" to={`/apps/${project.slug}#app-demo`}><Play aria-hidden="true" fill="currentColor" />Watch demo</Link> : <span className="button button-secondary is-disabled">Demo TODO</span>}
                  <GlowButton to={`/apps/${project.slug}`}>View case study</GlowButton>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <SiteFooter />
    </div>
  )
}
