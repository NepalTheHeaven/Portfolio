import { GlowButton } from '../components/GlowButton'
import { MetallicHeading } from '../components/MetallicHeading'
import { usePageMeta } from '../hooks/usePageMeta'

export function NotFoundPage() {
  usePageMeta({ title: 'Page Not Found', description: 'The requested portfolio page could not be found.' })
  return <section className="not-found"><p className="section-label">404 / Lost frame</p><MetallicHeading as="h1">Nothing here.</MetallicHeading><p>This route fell outside the edit.</p><GlowButton to="/">Return home</GlowButton></section>
}
