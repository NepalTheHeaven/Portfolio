import { useEffect, useRef, useState } from 'react'
import { Mail, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { portfolio } from '../data/portfolio'
import {
  isSectionRoute,
  scrollToSectionByRoute,
  useFlowNavigation,
} from '../context/FlowNavigationContext'

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const { pathname } = useLocation()
  const { activeSection } = useFlowNavigation()

  const isRouteActive = (href: string) => {
    if (isSectionRoute(pathname)) {
      return activeSection === href
    }
    return href !== '/' && pathname.startsWith(href)
  }

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    if (isSectionRoute(href) && isSectionRoute(pathname)) {
      scrollToSectionByRoute(href)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    firstLinkRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        menuButtonRef.current?.focus()
        return
      }
      if (event.key === 'Tab') {
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('#mobile-navigation a:not([tabindex="-1"])'))
        const first = links[0]
        const last = links.at(-1)
        if (!first || !last) return
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.body.classList.add('menu-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <header className="site-header">
      <Link className="brand" to="/" onClick={() => handleNavClick('/')} aria-label="Nabin Paudel — home">
        <span className="brand-mark" aria-hidden="true">{portfolio.personal.monogram}</span>
        <span className="brand-name">{portfolio.personal.name}</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {portfolio.navigation.slice(1).map((item) => {
          const active = isRouteActive(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              className={active ? 'active target-current' : ''}
              aria-current={active ? 'true' : undefined}
              onClick={() => handleNavClick(item.href)}
              data-magnetic
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Link className="header-contact" to="/contact" onClick={() => handleNavClick('/contact')} aria-label="Start a project" data-magnetic>
        <Mail aria-hidden="true" size={19} />
      </Link>

      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${isOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <span className="mobile-nav-label">Navigate</span>
        {portfolio.navigation.map((item, index) => {
          const active = isRouteActive(item.href)
          return (
            <Link
              ref={index === 0 ? firstLinkRef : undefined}
              key={item.href}
              to={item.href}
              className={active ? 'active target-current' : ''}
              aria-current={active ? 'true' : undefined}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => handleNavClick(item.href)}
            >
              <span>{item.step}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
