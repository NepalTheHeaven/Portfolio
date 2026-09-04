import type { ElementType, ReactNode } from 'react'

interface MetallicHeadingProps {
  as?: ElementType
  children: ReactNode
  className?: string
}

export function MetallicHeading({
  as: Tag = 'h1',
  children,
  className = '',
}: MetallicHeadingProps) {
  return <Tag className={`metallic-heading ${className}`.trim()}>{children}</Tag>
}
