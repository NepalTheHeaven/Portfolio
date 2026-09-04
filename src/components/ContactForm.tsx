import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'

type FormState = 'idle' | 'loading' | 'error'
type FieldName = 'name' | 'email' | 'projectType' | 'budget' | 'deadline' | 'description'
type FieldErrors = Partial<Record<FieldName, string>>

function validate(form: HTMLFormElement): FieldErrors {
  const data = new FormData(form)
  const fields: FieldName[] = ['name', 'email', 'projectType', 'budget', 'deadline', 'description']
  const errors: FieldErrors = {}
  for (const field of fields) {
    if (!String(data.get(field) ?? '').trim()) errors[field] = 'This field is required.'
  }
  const email = String(data.get('email') ?? '')
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.'
  return errors
}

export function ContactForm() {
  const [status, setStatus] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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

  return (
    <form className="contact-form" noValidate onSubmit={submit} aria-describedby="form-status">
      <div className="field field-full">
        <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
        <input id="name" name="name" autoComplete="name" placeholder="Your full name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} onChange={() => clearError('name')} />
        {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} onChange={() => clearError('email')} />
        {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
      </div>
      <div className="field">
        <label htmlFor="projectType">Project type <span aria-hidden="true">*</span></label>
        <select id="projectType" name="projectType" defaultValue="" aria-invalid={Boolean(errors.projectType)} aria-describedby={errors.projectType ? 'projectType-error' : undefined} onChange={() => clearError('projectType')}>
          <option value="" disabled>Select project type</option>
          <option>Video editing</option><option>Short-form reel</option><option>Promotional video</option><option>Colour grading</option><option>Flutter application</option><option>Mobile UI implementation</option><option>Other</option>
        </select>
        {errors.projectType && <span className="field-error" id="projectType-error">{errors.projectType}</span>}
      </div>
      <div className="field">
        <label htmlFor="budget">Budget <span aria-hidden="true">*</span></label>
        <select id="budget" name="budget" defaultValue="" aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? 'budget-error' : undefined} onChange={() => clearError('budget')}>
          <option value="" disabled>Select budget range</option><option>Under $250</option><option>$250–$750</option><option>$750–$1,500</option><option>$1,500+</option><option>Let’s discuss</option>
        </select>
        {errors.budget && <span className="field-error" id="budget-error">{errors.budget}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="deadline">Expected deadline <span aria-hidden="true">*</span></label>
        <input id="deadline" name="deadline" placeholder="e.g. 30 October 2026" aria-invalid={Boolean(errors.deadline)} aria-describedby={errors.deadline ? 'deadline-error' : undefined} onChange={() => clearError('deadline')} />
        {errors.deadline && <span className="field-error" id="deadline-error">{errors.deadline}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="description">Project description <span aria-hidden="true">*</span></label>
        <textarea id="description" name="description" rows={5} placeholder="Tell me about your project, goals, timeline, and anything that helps me understand your vision…" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} onChange={() => clearError('description')} />
        {errors.description && <span className="field-error" id="description-error">{errors.description}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="reference">Reference video, document, or file link <span className="optional">Optional</span></label>
        <input id="reference" name="reference" type="url" placeholder="https://…" />
      </div>
      <button className="submit-button" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Checking form…' : 'Send inquiry'}<Send aria-hidden="true" /></button>
      <p className={`form-status ${status === 'error' ? 'is-error' : ''}`} id="form-status" aria-live="polite">
        {status === 'error' ? 'Message delivery is not connected yet. Your details were not sent. Use the email contact once Nabin adds it.' : 'Required fields are marked *. Form delivery is a documented TODO until a backend is connected.'}
      </p>
    </form>
  )
}
