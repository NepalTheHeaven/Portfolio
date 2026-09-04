import { BriefcaseBusiness, GitFork, Mail } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { portfolio } from '../data/portfolio'

export function SideRail() {
  return (
    <aside className="side-rail" aria-label="Page index">
      <div className="rail-progress" aria-hidden="true"><span /></div>
      <nav>
        {portfolio.navigation.map((item) => (
          <NavLink key={item.href} to={item.href} end={item.href === '/'}>
            <span>{item.step}</span>
            <small>{item.label === 'Home' ? 'Intro' : item.label}</small>
          </NavLink>
        ))}
      </nav>
      <div className="rail-socials" aria-label="Social links">
        <span aria-label="GitHub link coming soon"><GitFork aria-hidden="true" /></span>
        <span aria-label="LinkedIn link coming soon"><BriefcaseBusiness aria-hidden="true" /></span>
        <NavLink to="/contact" aria-label="Contact Nabin"><Mail aria-hidden="true" /></NavLink>
      </div>
    </aside>
  )
}
