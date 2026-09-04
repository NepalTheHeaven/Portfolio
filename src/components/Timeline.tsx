import type { TimelineItem } from '../types/portfolio'

interface TimelineProps { items: TimelineItem[] }

export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="timeline">
      {items.map((item, index) => (
        <li key={item.title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div><h3>{item.title}</h3><p>{item.description}</p></div>
        </li>
      ))}
    </ol>
  )
}
