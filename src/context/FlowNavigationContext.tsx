import { createContext, useContext } from 'react'

export type SectionRoute = '/' | '/work' | '/apps' | '/story' | '/contact'

export const SECTION_ID_BY_ROUTE: Record<SectionRoute, string> = {
  '/': 'section-home',
  '/work': 'section-work',
  '/apps': 'section-apps',
  '/story': 'section-story',
  '/contact': 'section-contact',
}

export const SECTION_ROUTES: SectionRoute[] = ['/', '/work', '/apps', '/story', '/contact']

export function isSectionRoute(path: string): path is SectionRoute {
  return (SECTION_ROUTES as string[]).includes(path)
}

export function scrollToSectionByRoute(route: SectionRoute, smooth = true) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = smooth && !prefersReducedMotion ? 'smooth' : 'auto'
  if (route === '/') {
    window.scrollTo({ top: 0, behavior })
    return
  }
  const id = SECTION_ID_BY_ROUTE[route]
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' })
  }
}

interface FlowNavigationContextValue {
  activeSection: SectionRoute
  setActiveSection: (route: SectionRoute) => void
}

export const FlowNavigationContext = createContext<FlowNavigationContextValue>({
  activeSection: '/',
  setActiveSection: () => {},
})

export function useFlowNavigation() {
  return useContext(FlowNavigationContext)
}
