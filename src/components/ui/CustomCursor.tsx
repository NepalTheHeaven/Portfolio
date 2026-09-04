import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { usePointerCapabilities } from '../../hooks/usePointerCapabilities'

type CursorMode = 'default' | 'hover' | 'label' | 'text' | 'field'

/** Elements that make the follower ring expand (normal interactive targets). */
const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  '[role="button"]',
  'summary',
  '.video-card',
  '.app-card',
  '.showcase-card',
  '[data-cursor-interactive]',
].join(',')

/** Elements where the custom cursor steps aside and the OS cursor returns
    (form fields, editable/selectable inputs and native-style media controls). */
const FIELD_SELECTOR = [
  'input:not([data-cursor-label])',
  'textarea',
  'select',
  'label',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  'video[controls]',
  '.video-controls',
  '.comparison-controls',
  '[data-cursor-native]',
].join(',')

/** Long-form body copy where the I-beam should remain available for selection.
    Headings are deliberately excluded — they keep the custom cursor. */
const TEXT_SELECTOR = 'p,li,dd,dt,blockquote,figcaption,code'

const RING = {
  default: { size: 40, border: 'rgba(157, 98, 255, 0.55)', shadow: '0 0 14px 1px rgba(157, 98, 255, 0.16)', dot: 1 },
  hover: { size: 58, border: 'rgba(167, 131, 255, 0.8)', shadow: '0 0 22px 3px rgba(157, 98, 255, 0.26)', dot: 0.55 },
  label: { size: 74, border: 'rgba(167, 131, 255, 0.9)', shadow: '0 0 30px 5px rgba(157, 98, 255, 0.34)', dot: 0 },
  text: { size: 40, border: 'rgba(157, 98, 255, 0.55)', shadow: '0 0 14px 1px rgba(157, 98, 255, 0.16)', dot: 1 },
  field: { size: 40, border: 'rgba(157, 98, 255, 0.55)', shadow: '0 0 14px 1px rgba(157, 98, 255, 0.16)', dot: 1 },
} as const

const MAGNET_STRENGTH = 0.32
const MAGNET_MAX = 8

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

interface CursorState {
  x: number
  y: number
  visible: boolean
  primed: boolean
  mode: CursorMode
  label: string
  lastEl: Element | null
  mag: HTMLElement | null
  magRect: DOMRect | null
  magX: ((value: number) => void) | null
  magY: ((value: number) => void) | null
}

export function CustomCursor() {
  const enabled = usePointerCapabilities()
  const rootRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const resetRef = useRef<() => void>(() => {})
  const { pathname } = useLocation()

  useEffect(() => {
    if (!enabled) return
    const root = rootRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const labelEl = labelRef.current
    if (!root || !ring || !dot || !labelEl) return

    const docEl = document.documentElement
    const state: CursorState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      visible: false,
      primed: false,
      mode: 'default',
      label: '',
      lastEl: null,
      mag: null,
      magRect: null,
      magX: null,
      magY: null,
    }

    gsap.set(ring, { xPercent: -50, yPercent: -50, width: RING.default.size, height: RING.default.size })
    gsap.set(dot, { xPercent: -50, yPercent: -50 })
    gsap.set(labelEl, { autoAlpha: 0, scale: 0.8 })

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.26, ease: 'power2.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.26, ease: 'power2.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power2.out' })

    docEl.classList.add('cursor-enabled')

    const showRoot = () => {
      if (state.visible && state.mode !== 'field' && state.mode !== 'text') {
        gsap.to(root, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' })
      }
    }

    const setMode = (next: CursorMode) => {
      if (next === state.mode) return
      state.mode = next
      const native = next === 'field' || next === 'text'
      docEl.classList.toggle('cursor-native', native)
      gsap.to(root, {
        autoAlpha: state.visible && !native ? 1 : 0,
        duration: 0.25,
        overwrite: 'auto',
      })
      const config = RING[next]
      gsap.to(ring, {
        width: config.size,
        height: config.size,
        borderColor: config.border,
        boxShadow: config.shadow,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: 'auto',
      })
      gsap.to(dot, { scale: config.dot, duration: 0.22, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(labelEl, {
        autoAlpha: next === 'label' ? 1 : 0,
        scale: next === 'label' ? 1 : 0.8,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const setMagnet = (next: HTMLElement | null) => {
      if (next === state.mag) return
      if (state.mag) {
        gsap.to(state.mag, { x: 0, y: 0, duration: 0.4, ease: 'power2.out', overwrite: true })
      }
      state.mag = next
      if (next) {
        state.magRect = next.getBoundingClientRect()
        state.magX = gsap.quickTo(next, 'x', { duration: 0.3, ease: 'power2.out' })
        state.magY = gsap.quickTo(next, 'y', { duration: 0.3, ease: 'power2.out' })
      } else {
        state.magRect = null
        state.magX = null
        state.magY = null
      }
    }

    const evaluate = (target: Element | null) => {
      if (!target) {
        setMagnet(null)
        setMode('default')
        return
      }
      setMagnet(target.closest<HTMLElement>('[data-magnetic]'))

      if (target.closest(FIELD_SELECTOR)) {
        setMode('field')
        return
      }
      const labelHost = target.closest('[data-cursor-label]')
      if (labelHost) {
        const text = labelHost.getAttribute('data-cursor-label') ?? ''
        if (text !== state.label) {
          state.label = text
          labelEl.textContent = text
        }
        setMode('label')
        return
      }
      if (target.closest(INTERACTIVE_SELECTOR)) {
        setMode('hover')
        return
      }
      if (target.closest(TEXT_SELECTOR) && !target.closest('a[href],button,[role="button"],label')) {
        setMode('text')
        return
      }
      setMode('default')
    }

    const applyMagnet = () => {
      if (!state.mag || !state.magRect || !state.magX || !state.magY) return
      const rect = state.magRect
      const centreX = rect.left + rect.width / 2
      const centreY = rect.top + rect.height / 2
      state.magX(clamp((state.x - centreX) * MAGNET_STRENGTH, -MAGNET_MAX, MAGNET_MAX))
      state.magY(clamp((state.y - centreY) * MAGNET_STRENGTH, -MAGNET_MAX, MAGNET_MAX))
    }

    const onMove = (event: PointerEvent) => {
      state.x = event.clientX
      state.y = event.clientY
      if (!state.primed) {
        state.primed = true
        gsap.set([ring, dot], { x: event.clientX, y: event.clientY })
      }
      ringX(event.clientX)
      ringY(event.clientY)
      dotX(event.clientX)
      dotY(event.clientY)
      if (!state.visible) {
        state.visible = true
        showRoot()
      }
      const target = event.target instanceof Element ? event.target : null
      if (target !== state.lastEl) {
        state.lastEl = target
        evaluate(target)
      }
      applyMagnet()
    }

    let scrollFrame = 0
    const onScroll = () => {
      if (state.mag) state.magRect = state.mag.getBoundingClientRect()
      if (scrollFrame) return
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0
        const el = document.elementFromPoint(state.x, state.y)
        if (el && el !== state.lastEl) {
          state.lastEl = el
          evaluate(el)
        }
      })
    }

    const onLeave = () => {
      state.visible = false
      gsap.to(root, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' })
    }
    const onEnter = () => {
      state.visible = true
      showRoot()
    }

    const fullReset = () => {
      setMagnet(null)
      state.lastEl = null
      state.label = ''
      setMode('default')
    }
    resetRef.current = fullReset

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('blur', onLeave)
    docEl.addEventListener('mouseleave', onLeave)
    docEl.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('blur', onLeave)
      docEl.removeEventListener('mouseleave', onLeave)
      docEl.removeEventListener('mouseenter', onEnter)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
      resetRef.current = () => {}
      gsap.killTweensOf([root, ring, dot, labelEl])
      gsap.killTweensOf('[data-magnetic]')
      gsap.set('[data-magnetic]', { clearProps: 'transform' })
      docEl.classList.remove('cursor-enabled', 'cursor-native')
    }
  }, [enabled])

  useEffect(() => {
    resetRef.current()
  }, [pathname])

  if (!enabled) return null

  return (
    <div ref={rootRef} className="cursor-root" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
