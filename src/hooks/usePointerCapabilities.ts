import { useEffect, useState } from 'react'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function readSupport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(FINE_POINTER).matches && !window.matchMedia(REDUCED_MOTION).matches
}

/**
 * Returns `true` only when a custom cursor is appropriate:
 * a hover-capable, fine pointer is present AND the user has not asked for reduced motion.
 * Re-evaluates live when the device pointer or the motion preference changes.
 */
export function usePointerCapabilities(): boolean {
  const [supported, setSupported] = useState(readSupport)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const pointerQuery = window.matchMedia(FINE_POINTER)
    const motionQuery = window.matchMedia(REDUCED_MOTION)
    const update = () => setSupported(pointerQuery.matches && !motionQuery.matches)
    update()
    pointerQuery.addEventListener('change', update)
    motionQuery.addEventListener('change', update)
    return () => {
      pointerQuery.removeEventListener('change', update)
      motionQuery.removeEventListener('change', update)
    }
  }, [])

  return supported
}
