import { BriefcaseBusiness, GitFork, Mail } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { portfolio } from '../data/portfolio'
import {
  isSectionRoute,
  scrollToSectionByRoute,
  SECTION_ROUTES,
  useFlowNavigation,
} from '../context/FlowNavigationContext'

export function SideRail() {
  const { pathname } = useLocation()
  const { activeSection } = useFlowNavigation()
  const githubLink = portfolio.socialLinks.find((item) => item.label === 'GitHub')?.href ?? 'https://github.com/NepalTheHeaven'
  const linkedinLink = portfolio.socialLinks.find((item) => item.label === 'LinkedIn')?.href ?? 'https://www.linkedin.com/in/nabin-paudel-video-editor'

  const isRouteActive = (href: string) => {
    if (isSectionRoute(pathname)) {
      return activeSection === href
    }
    return href !== '/' && pathname.startsWith(href)
  }

  const activeIndex = Math.max(
    0,
    SECTION_ROUTES.findIndex((route) => isRouteActive(route)),
  )
  const progressPercent = (activeIndex / Math.max(1, SECTION_ROUTES.length - 1)) * 92 + 4

  const handleRailClick = (href: string) => {
    if (isSectionRoute(href) && isSectionRoute(pathname)) {
      scrollToSectionByRoute(href)
    }
  }

  return (
    <aside className="side-rail" aria-label="Page index">
      <div className="side-rail-sticky">
        <div className="rail-progress" aria-hidden="true">
          <span style={{ top: `${progressPercent}%` }} />
        </div>
        <nav>
          {portfolio.navigation.map((item) => {
            const active = isRouteActive(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={active ? 'active target-current' : ''}
                aria-current={active ? 'true' : undefined}
                onClick={() => handleRailClick(item.href)}
              >
                <span>{item.step}</span>
                <small>{item.label === 'Home' ? 'Intro' : item.label}</small>
              </Link>
            )
          })}
        </nav>
        <div className="rail-socials" aria-label="Social links">
          <a href={githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" data-magnetic><GitFork aria-hidden="true" /></a>
          <a href={linkedinLink} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" data-magnetic><BriefcaseBusiness aria-hidden="true" /></a>
          <Link to="/contact" onClick={() => handleRailClick('/contact')} aria-label="Contact Nabin" data-magnetic><Mail aria-hidden="true" /></Link>
        </div>
      </div>
    </aside>
  )
}
