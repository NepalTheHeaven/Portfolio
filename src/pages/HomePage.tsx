import { useRef } from 'react'
import { ArrowDownRight, ArrowRight, Play, Smartphone, WandSparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { MetallicHeading } from '../components/MetallicHeading'
import { portfolio } from '../data/portfolio'
import { usePageMeta } from '../hooks/usePageMeta'
import { SiteFooter } from '../components/SiteFooter'

export function HomePage() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from('.hero-line-mask > span', { yPercent: 115, opacity: 0, duration: 1, stagger: .08, ease: 'power4.out' })
    gsap.from('.home-copy > :not(.home-title)', { y: 15, opacity: 0, duration: .65, stagger: .06, delay: .3, ease: 'power3.out' })
  }, { scope: root })
  usePageMeta({ title: 'Video Editor & Mobile App Developer', description: 'Nabin Paudel cuts stories and builds mobile products — video editing and application development from Nepal.', structuredData: { '@context': 'https://schema.org', '@type': 'Person', name: 'Nabin Paudel', jobTitle: ['Video Editor', 'Mobile Application Developer'], address: { '@type': 'PostalAddress', addressCountry: 'NP' } } })
  return (
    <div ref={root} className="home-page page-enter">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <p className="eyebrow">{portfolio.hero.eyebrow}</p>
          <MetallicHeading as="h1" className="home-title">
            <span className="hero-line-mask"><span id="home-title">{portfolio.hero.lines[0]}</span></span>
            <span className="hero-line-mask"><span className="accent-line">{portfolio.hero.lines[1]}</span></span>
          </MetallicHeading>
          <p className="hero-role">{portfolio.hero.supportingLine}</p>
          <p className="hero-intro">{portfolio.hero.introduction}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/work">
              <Play aria-hidden="true" size={17} fill="currentColor" /> View showreel
            </Link>
            <Link className="button button-secondary" to="/work">
              Explore work <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <p className="availability"><span aria-hidden="true" />{portfolio.personal.availability}</p>
        </div>

        <div className="hero-showcase" aria-label="Selected portfolio work">
          <div className="showcase-glow" aria-hidden="true" />
          <Link className="showcase-card showcase-edit" to="/work/edit-01">
            <div className="card-number">01 / EDIT</div>
            <div className="edit-visual">
              <div className="edit-scanline" />
              <WandSparkles aria-hidden="true" />
              <span>Before / After</span>
            </div>
            <div className="showcase-meta">
              <div><small>Selected motion</small><strong>Story in the grade</strong></div>
              <ArrowDownRight aria-hidden="true" />
            </div>
          </Link>
          <Link className="showcase-card showcase-app" to="/apps/samadhan">
            <div className="card-number">02 / APP</div>
            <div className="phone-preview">
              <img src="/images/projects/samadhan/Screenshot_20260904_153938_Expo Go.jpg.jpeg" alt="Samadhan mobile application interface" />
            </div>
            <div className="showcase-meta">
              <div><small>Mobile product</small><strong>Samadhan</strong></div>
              <Smartphone aria-hidden="true" />
            </div>
          </Link>
        </div>
      </section>
      <a className="scroll-cue" href="#selected-work"><span>Scroll to explore</span><ArrowDownRight aria-hidden="true" /></a>
      <section className="home-next" id="selected-work" aria-label="Selected disciplines">
        <p>Editing precision</p><span aria-hidden="true">×</span><p>Product thinking</p><span aria-hidden="true">×</span><p>Meaningful outcomes</p>
      </section>
      <SiteFooter />
    </div>
  )
}
