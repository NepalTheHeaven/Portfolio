import { Code2, Download, Film, GraduationCap } from 'lucide-react'
import { AchievementBadge } from '../components/AchievementBadge'
import { GlowButton } from '../components/GlowButton'
import { MetallicHeading } from '../components/MetallicHeading'
import { Reveal } from '../components/Reveal'
import { SkillGroup } from '../components/SkillGroup'
import { SiteFooter } from '../components/SiteFooter'
import { Timeline } from '../components/Timeline'
import { portfolio } from '../data/portfolio'
import { usePageMeta } from '../hooks/usePageMeta'

interface StoryPageProps {
  embedded?: boolean
}

export function StoryPage({ embedded = false }: StoryPageProps) {
  usePageMeta({
    title: 'Between Frames & Functions',
    description: 'The personal journey, skills, tools, and approach of Nabin Paudel — video editor, IT student, and mobile app developer.',
    disabled: embedded,
  })
  return (
    <div className="story-page page-enter">
      <section className="story-hero">
        <div className="portrait-placeholder" role="img" aria-label="Professional portrait placeholder for Nabin Paudel">
          <div className="portrait-aura" /><span>NP</span><small>TODO<br />Add professional portrait</small>
        </div>
        <div className="story-title-zone">
          <p className="section-label">04 / My story</p>
          <MetallicHeading as="h1" className="story-title">Between<br />Frames &amp;<br /><span>Functions</span></MetallicHeading>
          <div className="identity-chips"><span><Film aria-hidden="true" />Video editor</span><span><GraduationCap aria-hidden="true" />IT student</span><span><Code2 aria-hidden="true" />Flutter developer</span></div>
        </div>
        <div className="journey-copy"><p className="section-label">My journey</p><p>{portfolio.personal.introduction}</p><AchievementBadge /></div>
      </section>

      <Reveal className="timeline-section"><Timeline items={portfolio.timeline} /></Reveal>
      <Reveal className="skills-section"><div className="section-heading"><div><p className="section-label">Capabilities</p><h2>One toolkit, two disciplines.</h2></div><p>The confirmed skills below are editable from one central content file.</p></div><div className="skill-grid">{portfolio.skillGroups.map((group, index) => <SkillGroup key={group.title} group={group} index={index} />)}</div></Reveal>
      <section className="resume-cta"><div><p className="section-label">Curriculum vitae</p><h2>Need the complete picture?</h2><p>The resume file is ready to be linked as soon as the real PDF is added.</p></div><GlowButton to={portfolio.resumePath} disabled><Download aria-hidden="true" size={17} /> Resume TODO</GlowButton></section>
      <section className="contact-cta"><p className="section-label">The next chapter</p><h2>Let’s build something that moves people.</h2><GlowButton to="/contact">Start a conversation</GlowButton></section>
      {!embedded && <SiteFooter />}
    </div>
  )
}
