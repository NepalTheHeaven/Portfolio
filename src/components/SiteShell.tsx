import { useEffect, useState, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SideRail } from './SideRail'
import { CustomCursor } from './ui/CustomCursor'
import {
  FlowNavigationContext,
  isSectionRoute,
  type SectionRoute,
} from '../context/FlowNavigationContext'

interface SiteShellProps {
  children?: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  const { pathname } = useLocation()
  const [activeSection, setActiveSection] = useState<SectionRoute>(() =>
    isSectionRoute(pathname) ? pathname : '/',
  )

  useEffect(() => {
    if (!isSectionRoute(pathname)) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [pathname])

  return (
    <FlowNavigationContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="site-frame">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="background-grid" aria-hidden="true" />
        <SiteHeader />
        <SideRail />
        <main id="main-content" tabIndex={-1}>{children ?? <Outlet />}</main>
        <CustomCursor />
      </div>
    </FlowNavigationContext.Provider>
  )
}
