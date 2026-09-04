import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ProjectLink { label: string; href: string }
interface ProjectNavigationProps { previous: ProjectLink; next: ProjectLink }

export function ProjectNavigation({ previous, next }: ProjectNavigationProps) {
  return (
    <nav className="project-navigation" aria-label="Project navigation">
      <Link to={previous.href}><ArrowLeft aria-hidden="true" /><span><small>Previous</small>{previous.label}</span></Link>
      <Link to={next.href}><span><small>Next</small>{next.label}</span><ArrowRight aria-hidden="true" /></Link>
    </nav>
  )
}
