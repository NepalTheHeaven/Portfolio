import { ArrowRight, Code2, Film, Mail, MapPin, Network } from 'lucide-react'
import { ContactForm } from '../components/ContactForm'
import { MetallicHeading } from '../components/MetallicHeading'
import { SiteFooter } from '../components/SiteFooter'
import { portfolio } from '../data/portfolio'
import { usePageMeta } from '../hooks/usePageMeta'

interface ContactPageProps {
  embedded?: boolean
}

export function ContactPage({ embedded = false }: ContactPageProps) {
  usePageMeta({
    title: 'Let’s Create Something That Moves',
    description: 'Contact Nabin Paudel for video editing, colour grading, Flutter development, and mobile UI implementation.',
    disabled: embedded,
  })
  return (
    <div className="contact-page page-enter">
      <section className="contact-layout">
        <div className="contact-copy">
          <p className="section-label">05 / Project inquiry</p>
          <MetallicHeading as="h1" className="contact-title">Let’s create<br />something<br />that <span>moves</span></MetallicHeading>
          <p className="availability"><span aria-hidden="true" />{portfolio.personal.availability}</p>
          <div className="service-list">
            {portfolio.services.map((service) => <article key={service.title}><i>{service.type === 'video' ? <Film aria-hidden="true" /> : <Code2 aria-hidden="true" />}</i><div><h2>{service.title}</h2><p>{service.description}</p></div><ArrowRight aria-hidden="true" /></article>)}
          </div>
        </div>
        <ContactForm />
      </section>
      <section className="contact-details" aria-label="Contact details">
        <div><i><Mail aria-hidden="true" /></i><span><small>Email</small>{portfolio.personal.email}</span></div>
        <div><i><Network aria-hidden="true" /></i><span><small>LinkedIn</small>TODO: Add LinkedIn URL</span></div>
        <div><i><Code2 aria-hidden="true" /></i><span><small>GitHub</small>TODO: Add GitHub URL</span></div>
        <div><i><MapPin aria-hidden="true" /></i><span><small>Location</small>{portfolio.personal.location}</span></div>
      </section>
      <SiteFooter />
    </div>
  )
}
