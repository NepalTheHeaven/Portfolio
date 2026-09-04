import { useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import { PageIntro } from '../components/PageIntro'
import { VideoCard } from '../components/VideoCard'
import { BeforeAfterVideo } from '../components/BeforeAfterVideo'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { videoProjects } from '../data/portfolio'
import type { WorkCategory } from '../types/portfolio'
import { usePageMeta } from '../hooks/usePageMeta'

const filters: Array<'All' | Exclude<WorkCategory, 'Uncategorised'>> = ['All', 'Reels', 'Cinematic', 'Commercial', 'Motion Graphics']

export function WorkPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const projects = useMemo(() => filter === 'All' ? videoProjects : videoProjects.filter((project) => project.category === filter), [filter])
  const featured = videoProjects[0]
  usePageMeta({ title: 'Selected Motion', description: 'Video-editing work by Nabin Paudel: cinematic stories, short-form edits, colour grading, sound design, and motion.' })

  return (
    <div className="work-page page-enter">
      <section className="work-heading-zone">
        <PageIntro label="02 / Selected work" title="Selected" accent="Motion" description="Editing built around feeling, clarity, and the exact frame where everything clicks." />
        <div className="filter-list" role="group" aria-label="Filter video projects">
          {filters.map((item) => <button type="button" className={filter === item ? 'active' : ''} aria-pressed={filter === item} key={item} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
      </section>

      <section className="showreel-strip" aria-labelledby="showreel-title">
        <div className="showreel-mark"><Play aria-hidden="true" fill="currentColor" /></div>
        <div><p className="section-label">Featured showreel</p><h2 id="showreel-title">A reel is ready for your final film.</h2><p>Add the real showreel at <code>public/videos/showreel/</code> and update the central data file.</p></div>
        <span>TODO / MEDIA</span>
      </section>

      <Reveal>
        <section className="video-grid" aria-live="polite">
          {projects.length ? projects.map((project, index) => <VideoCard key={project.slug} project={project} index={index} />) : <div className="empty-filter"><strong>No confirmed projects in this category yet.</strong><p>Assign real categories in <code>src/data/portfolio.ts</code>.</p></div>}
        </section>
      </Reveal>

      {featured?.beforeAfter && (
        <Reveal className="featured-comparison">
          <div className="section-heading"><div><p className="section-label">Before / after</p><h2>The edit changes the feeling.</h2></div><p>Drag the handle to compare the original and final footage. Playback and seeking stay synchronized.</p></div>
          <BeforeAfterVideo {...featured.beforeAfter} title="Edit project 01 comparison" description={featured.description} orientation="wide" />
        </Reveal>
      )}
      <SiteFooter />
    </div>
  )
}
