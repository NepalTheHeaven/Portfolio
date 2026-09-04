export type WorkCategory = 'Reels' | 'Cinematic' | 'Commercial' | 'Motion Graphics' | 'Uncategorised'

export interface NavigationItem { label: string; href: string; step: string }
export interface PersonalInfo { name: string; monogram: string; roles: string[]; location: string; email: string; availability: string; introduction: string }
export interface HeroContent { eyebrow: string; lines: [string, string]; supportingLine: string; introduction: string }
export interface SocialLink { label: string; href: string }
export interface BeforeAfterMedia { beforeVideo: string; afterVideo: string; poster?: string; beforeLabel: string; afterLabel: string }

export interface VideoProject {
  slug: string
  title: string
  category: WorkCategory
  duration: string
  date: string
  description: string
  tools: string[]
  video?: string
  poster?: string
  client?: string
  testimonial?: string
  beforeAfter?: BeforeAfterMedia
  objective: string
  context: string
  editingApproach: string
  colourApproach: string
  soundApproach: string
  motionApproach: string
  challenges: string
  result: string
}

export interface AppProject {
  slug: string
  name: string
  explanation: string
  problem: string
  research: string
  solution: string
  contribution: string
  features: string[]
  technologies: string[]
  hackathonName: string
  hackathonDate: string
  achievement: string
  isNationalWinner: boolean
  screenshots: string[]
  demoVideo?: string
  githubUrl: string
  demoUrl: string
  architecture: string
  challenges: string
  lessons: string
}

export interface TimelineItem { title: string; description: string }
export interface SkillGroup { title: string; skills: string[] }
export interface Service { title: string; description: string; type: 'video' | 'development' }

export interface PortfolioData {
  siteUrl: string
  personal: PersonalInfo
  hero: HeroContent
  navigation: NavigationItem[]
  socialLinks: SocialLink[]
  videoProjects: VideoProject[]
  appProjects: AppProject[]
  timeline: TimelineItem[]
  skillGroups: SkillGroup[]
  services: Service[]
  resumePath: string
}
