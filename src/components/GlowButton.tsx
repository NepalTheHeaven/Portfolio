import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

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

export function GlowButton({ to, children, secondary = false, external = false, disabled = false, magnetic, cursorLabel }: GlowButtonProps) {
  const className = `button ${secondary ? 'button-secondary' : 'button-primary'} ${disabled ? 'is-disabled' : ''}`
  if (disabled) return <span className={className} aria-disabled="true">{children}</span>

  const cursorProps = {
    'data-magnetic': (magnetic ?? true) ? '' : undefined,
    'data-cursor-label': cursorLabel ?? (external ? 'OPEN' : undefined),
  }
  if (external) return <a className={className} href={to} target="_blank" rel="noreferrer" {...cursorProps}>{children}<ArrowRight aria-hidden="true" size={17} /></a>
  return <Link className={className} to={to} {...cursorProps}>{children}<ArrowRight aria-hidden="true" size={17} /></Link>
}
