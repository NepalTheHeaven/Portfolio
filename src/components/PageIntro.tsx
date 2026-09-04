import { MetallicHeading } from './MetallicHeading'

interface PageIntroProps { label: string; title: string; accent?: string; description?: string; align?: 'left' | 'center' }

export function PageIntro({ label, title, accent, description, align = 'left' }: PageIntroProps) {
  return (
    <header className={`page-intro page-intro-${align}`}>
      <p className="section-label">{label}</p>
      <MetallicHeading as="h1" className="page-title">
        {title}{accent && <> <span>{accent}</span></>}
      </MetallicHeading>
      {description && <p className="page-description">{description}</p>}
    </header>
  )
}
