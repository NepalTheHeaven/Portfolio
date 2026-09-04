import { useEffect, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SideRail } from './SideRail'
import { CustomCursor } from './ui/CustomCursor'

interface SiteShellProps {
  children?: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [pathname])
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="background-grid" aria-hidden="true" />
      <SiteHeader />
      <SideRail />
      <main id="main-content" tabIndex={-1}>{children ?? <Outlet />}</main>
      <CustomCursor />
    </div>
  )
}
