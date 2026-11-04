import { useEffect } from 'react'
import { portfolio } from '../data/portfolio'

interface PageMeta {
  title: string
  description: string
  structuredData?: Record<string, unknown>
  image?: string | null
}

const SITE_ORIGIN = portfolio.siteUrl
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-placeholder.svg`

function upsertMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(property ? 'property' : 'name', name)
    document.head.append(element)
  }
  element.content = content
}

export function usePageMeta({ title, description, structuredData, image = DEFAULT_IMAGE }: PageMeta) {
  useEffect(() => {
    document.title = `${title} — Nabin Paudel`
    upsertMeta('description', description)
    upsertMeta('og:title', document.title, true)
    upsertMeta('og:description', description, true)
    upsertMeta('og:type', 'website', true)
    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', document.title)
    upsertMeta('twitter:description', description)
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = `${SITE_ORIGIN}${window.location.pathname}`.replace('/Portfolio/Portfolio', '/Portfolio')
    if (!canonical.parentNode) document.head.append(canonical)
    if (image) {
      const resolvedImage = image.replace('/Portfolio/Portfolio/', '/Portfolio/')
      upsertMeta('og:image', resolvedImage, true)
      upsertMeta('twitter:image', resolvedImage)
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove()
      document.head.querySelector('meta[name="twitter:image"]')?.remove()
    }

    const id = 'route-structured-data'
    document.getElementById(id)?.remove()
    if (structuredData) {
      const script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      document.head.append(script)
    }
    return () => document.getElementById(id)?.remove()
  }, [description, image, structuredData, title])
}
