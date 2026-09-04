import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface RevealProps { children: ReactNode; className?: string; delay?: number }

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return
    gsap.fromTo(root.current, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: .8, delay, ease: 'power3.out',
      scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
    })
  }, { scope: root, dependencies: [delay] })
  return <div ref={root} className={className}>{children}</div>
}
