import { ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { portfolio } from '../data/portfolio'
import { isSectionRoute, scrollToSectionByRoute } from '../context/FlowNavigationContext'

export function SiteFooter() {
  const { pathname } = useLocation()
  const handleFooterClick = (href: string) => {
    if (isSectionRoute(href) && isSectionRoute(pathname)) {
      scrollToSectionByRoute(href)
    }
  }
  return (
    <footer className="site-footer">
      <div><span className="footer-monogram">NP</span><p>Stories in motion.<br />Products with purpose.</p></div>
      <nav aria-label="Footer navigation">
        {portfolio.navigation.map((item) => (
          <Link key={item.href} to={item.href} onClick={() => handleFooterClick(item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="footer-cta" to="/contact" onClick={() => handleFooterClick('/contact')}>
        Start a project <ArrowUpRight aria-hidden="true" />
      </Link>
      <small>© {new Date().getFullYear()} Nabin Paudel. Nepal.</small>
    </footer>
  )
}
