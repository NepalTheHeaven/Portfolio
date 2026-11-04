import { useState, type FocusEvent, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { portfolio } from '../data/portfolio'

type FormState = 'idle' | 'loading' | 'error'
type FieldName = 'name' | 'email' | 'projectType' | 'budget' | 'deadline' | 'description' | 'reference'
type FieldErrors = Partial<Record<FieldName, string>>

const REQUIRED_FIELDS: FieldName[] = ['name', 'email', 'projectType', 'budget', 'deadline', 'description']

function validateField(field: FieldName, value: string): string | undefined {
  const trimmed = value.trim()
  if (REQUIRED_FIELDS.includes(field) && !trimmed) {
    return 'This field is required.'
  }
  if (field === 'email' && trimmed && !/^\S+@\S+\.\S+$/.test(trimmed)) {
    return 'Enter a valid email address.'
  }
  if (field === 'reference' && trimmed) {
    try {
      const parsed = new URL(trimmed)
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return 'Enter a valid http:// or https:// URL.'
      }
    } catch {
      return 'Enter a valid http:// or https:// URL.'
    }
  }
  return undefined
}

function validate(form: HTMLFormElement): FieldErrors {
  const data = new FormData(form)
  const allFields: FieldName[] = [...REQUIRED_FIELDS, 'reference']
  const errors: FieldErrors = {}
  for (const field of allFields) {
    const error = validateField(field, String(data.get(field) ?? ''))
    if (error) errors[field] = error
  }
  return errors
}

export function ContactForm() {
  const [status, setStatus] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // Honeypot check against automated spam bots
    if (String(formData.get('website') ?? '').trim()) {
      return
    }
    const nextErrors = validate(event.currentTarget)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('loading')
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    setStatus('error')
  }

  const clearError = (field: FieldName) => setErrors((current) => ({ ...current, [field]: undefined }))

  const checkOnBlur = (field: FieldName) => (event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const error = validateField(field, event.currentTarget.value)
    setErrors((current) => ({ ...current, [field]: error }))
  }

  return (
    <form className="contact-form" method="post" noValidate onSubmit={submit} aria-describedby="form-status">
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field field-full">
        <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
        <input id="name" name="name" required maxLength={100} autoComplete="name" placeholder="Your full name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} onChange={() => clearError('name')} onBlur={checkOnBlur('name')} />
        {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} onChange={() => clearError('email')} onBlur={checkOnBlur('email')} />
        {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
      </div>
      <div className="field">
        <label htmlFor="projectType">Project type <span aria-hidden="true">*</span></label>
        <select id="projectType" name="projectType" required defaultValue="" aria-invalid={Boolean(errors.projectType)} aria-describedby={errors.projectType ? 'projectType-error' : undefined} onChange={() => clearError('projectType')} onBlur={checkOnBlur('projectType')}>
          <option value="" disabled>Select project type</option>
          <option>Video editing</option><option>Short-form reel</option><option>Promotional video</option><option>Colour grading</option><option>Flutter application</option><option>Mobile UI implementation</option><option>Other</option>
        </select>
        {errors.projectType && <span className="field-error" id="projectType-error">{errors.projectType}</span>}
      </div>
      <div className="field">
        <label htmlFor="budget">Budget <span aria-hidden="true">*</span></label>
        <select id="budget" name="budget" required defaultValue="" aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? 'budget-error' : undefined} onChange={() => clearError('budget')} onBlur={checkOnBlur('budget')}>
          <option value="" disabled>Select budget range</option><option>Under $250</option><option>$250–$750</option><option>$750–$1,500</option><option>$1,500+</option><option>Let’s discuss</option>
        </select>
        {errors.budget && <span className="field-error" id="budget-error">{errors.budget}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="deadline">Expected deadline <span aria-hidden="true">*</span></label>
        <input id="deadline" name="deadline" required maxLength={100} placeholder="e.g. 30 October 2026" aria-invalid={Boolean(errors.deadline)} aria-describedby={errors.deadline ? 'deadline-error' : undefined} onChange={() => clearError('deadline')} onBlur={checkOnBlur('deadline')} />
        {errors.deadline && <span className="field-error" id="deadline-error">{errors.deadline}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="description">Project description <span aria-hidden="true">*</span></label>
        <textarea id="description" name="description" required maxLength={2000} rows={5} placeholder="Tell me about your project, goals, timeline, and anything that helps me understand your vision…" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} onChange={() => clearError('description')} onBlur={checkOnBlur('description')} />
        {errors.description && <span className="field-error" id="description-error">{errors.description}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="reference">Reference video, document, or file link <span className="optional">Optional</span></label>
        <input id="reference" name="reference" type="url" maxLength={500} autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="https://…" aria-invalid={Boolean(errors.reference)} aria-describedby={errors.reference ? 'reference-error' : undefined} onChange={() => clearError('reference')} onBlur={checkOnBlur('reference')} />
        {errors.reference && <span className="field-error" id="reference-error">{errors.reference}</span>}
      </div>
      <button className="submit-button" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Checking form…' : 'Send inquiry'}<Send aria-hidden="true" /></button>
      <p className={`form-status ${status === 'error' ? 'is-error' : ''}`} id="form-status" aria-live="polite">
        {status === 'error' ? `Message delivery is not connected yet. Please email ${portfolio.personal.email} directly.` : 'Required fields are marked *. Form delivery is a documented TODO until a backend is connected.'}
      </p>
    </form>
  )
}
