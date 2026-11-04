import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { isSectionRoute, scrollToSectionByRoute } from '../context/FlowNavigationContext'

interface GlowButtonProps {
  to: string
  children: ReactNode
  secondary?: boolean
  external?: boolean
  disabled?: boolean
  /** Opt out of the magnetic cursor pull (on by default for active buttons). */
  magnetic?: boolean
  /** Contextual cursor label; defaults to `OPEN` for external links. */
  cursorLabel?: string
}

function isSafeExternalUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export function GlowButton({ to, children, secondary = false, external = false, disabled = false, magnetic, cursorLabel }: GlowButtonProps) {
  const isBlockedExternal = external && !isSafeExternalUrl(to)
  const isDisabled = disabled || isBlockedExternal
  const className = `button ${secondary ? 'button-secondary' : 'button-primary'} ${isDisabled ? 'is-disabled' : ''}`
  if (isDisabled) return <span className={className} aria-disabled="true">{children}</span>

  const cursorProps = {
    'data-magnetic': (magnetic ?? true) ? '' : undefined,
    'data-cursor-label': cursorLabel ?? (external ? 'OPEN' : undefined),
  }
  if (external) return <a className={className} href={to} target="_blank" rel="noopener noreferrer" {...cursorProps}>{children}<ArrowRight aria-hidden="true" size={17} /></a>
  return (
    <Link
      className={className}
      to={to}
      onClick={() => {
        if (isSectionRoute(to)) scrollToSectionByRoute(to)
      }}
      {...cursorProps}
    >
      {children}<ArrowRight aria-hidden="true" size={17} />
    </Link>
  )
}
