import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  isSectionRoute,
  scrollToSectionByRoute,
  SECTION_ID_BY_ROUTE,
  useFlowNavigation,
  type SectionRoute,
} from '../context/FlowNavigationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { HomePage } from './HomePage'
import { WorkPage } from './WorkPage'
import { AppsPage } from './AppsPage'
import { StoryPage } from './StoryPage'
import { ContactPage } from './ContactPage'

const SECTION_META: Record<SectionRoute, { title: string; description: string }> = {
  '/': {
    title: 'Video Editor & Mobile App Developer',
    description: 'Nabin Paudel cuts stories and builds mobile products — video editing and application development from Nepal.',
  },
  '/work': {
    title: 'Selected Motion',
    description: 'Video-editing work by Nabin Paudel: cinematic stories, short-form edits, colour grading, sound design, and motion.',
  },
  '/apps': {
    title: 'Products with Purpose',
    description: 'Mobile application projects built by Nabin Paudel, including a national-level hackathon winning project.',
  },
  '/story': {
    title: 'Between Frames & Functions',
    description: 'The personal journey, skills, tools, and approach of Nabin Paudel — video editor, IT student, and mobile app developer.',
  },
  '/contact': {
    title: 'Let’s Create Something That Moves',
    description: 'Contact Nabin Paudel for video editing, colour grading, Flutter development, and mobile UI implementation.',
  },
}

export function MainFlowPage() {
  const { pathname } = useLocation()
  const { activeSection, setActiveSection } = useFlowNavigation()
  const initialPathnameHandled = useRef(false)

  const currentMeta = SECTION_META[activeSection] ?? SECTION_META['/']
  usePageMeta({
    title: currentMeta.title,
    description: currentMeta.description,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Nabin Paudel',
      jobTitle: ['Video Editor', 'Mobile Application Developer'],
      address: { '@type': 'PostalAddress', addressCountry: 'NP' },
    },
  })

  // Scroll to target section on initial load or when route changes via link click
  useEffect(() => {
    const targetRoute: SectionRoute = isSectionRoute(pathname) ? pathname : '/'
    setActiveSection(targetRoute)
    if (!initialPathnameHandled.current) {
      initialPathnameHandled.current = true
      if (targetRoute !== '/') {
        requestAnimationFrame(() => scrollToSectionByRoute(targetRoute, false))
      }
      return
    }
    scrollToSectionByRoute(targetRoute, true)
  }, [pathname, setActiveSection])

  // Track visible section while scrolling from Intro -> Work -> Apps -> Story -> Contact
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-route]'))
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const route = entry.target.getAttribute('data-section-route')
            if (route && isSectionRoute(route)) {
              setActiveSection(route)
            }
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    for (const section of sections) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [setActiveSection])

  return (
    <div className="continuous-flow">
      <div id={SECTION_ID_BY_ROUTE['/']} data-section-route="/" className="flow-section">
        <HomePage embedded />
      </div>
      <div id={SECTION_ID_BY_ROUTE['/work']} data-section-route="/work" className="flow-section flow-section-divider">
        <WorkPage embedded />
      </div>
      <div id={SECTION_ID_BY_ROUTE['/apps']} data-section-route="/apps" className="flow-section flow-section-divider">
        <AppsPage embedded />
      </div>
      <div id={SECTION_ID_BY_ROUTE['/story']} data-section-route="/story" className="flow-section flow-section-divider">
        <StoryPage embedded />
      </div>
      <div id={SECTION_ID_BY_ROUTE['/contact']} data-section-route="/contact" className="flow-section flow-section-divider">
        <ContactPage embedded />
      </div>
    </div>
  )
}
