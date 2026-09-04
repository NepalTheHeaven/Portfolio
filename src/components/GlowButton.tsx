import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface GlowButtonProps { to: string; children: ReactNode; secondary?: boolean; external?: boolean; disabled?: boolean }

export function GlowButton({ to, children, secondary = false, external = false, disabled = false }: GlowButtonProps) {
  const className = `button ${secondary ? 'button-secondary' : 'button-primary'} ${disabled ? 'is-disabled' : ''}`
  if (disabled) return <span className={className} aria-disabled="true">{children}</span>
  if (external) return <a className={className} href={to} target="_blank" rel="noreferrer">{children}<ArrowRight aria-hidden="true" size={17} /></a>
  return <Link className={className} to={to}>{children}<ArrowRight aria-hidden="true" size={17} /></Link>
}
