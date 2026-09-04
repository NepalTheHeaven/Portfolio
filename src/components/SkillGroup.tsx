import { Code2, Film, Sparkles } from 'lucide-react'
import type { SkillGroup as SkillGroupType } from '../types/portfolio'

interface SkillGroupProps { group: SkillGroupType; index: number }

export function SkillGroup({ group, index }: SkillGroupProps) {
  const Icon = index === 0 ? Film : index === 1 ? Code2 : Sparkles
  return (
    <article className="skill-group">
      <header><Icon aria-hidden="true" /><h3>{group.title}</h3></header>
      <ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
    </article>
  )
}
