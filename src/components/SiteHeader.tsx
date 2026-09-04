import { useEffect, useRef, useState } from 'react'
import { Mail, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { portfolio } from '../data/portfolio'

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

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
      <Link className="brand" to="/" aria-label="Nabin Paudel — home">
        <span className="brand-mark" aria-hidden="true">{portfolio.personal.monogram}</span>
        <span className="brand-name">{portfolio.personal.name}</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {portfolio.navigation.slice(1).map((item) => (
          <NavLink key={item.href} to={item.href} data-magnetic>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Link className="header-contact" to="/contact" aria-label="Start a project" data-magnetic>
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
        {portfolio.navigation.map((item, index) => (
          <NavLink
            ref={index === 0 ? firstLinkRef : undefined}
            key={item.href}
            to={item.href}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => setIsOpen(false)}
          >
            <span>{item.step}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
