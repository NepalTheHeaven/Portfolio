import { useState, type FocusEvent, type FormEvent } from 'react'
import { Check, Send } from 'lucide-react'
import { portfolio } from '../data/portfolio'

type FormState = 'idle' | 'loading' | 'success' | 'error'
type FieldName = 'name' | 'email' | 'projectType' | 'budget' | 'deadline' | 'description' | 'reference'
type FieldErrors = Partial<Record<FieldName, string>>

const REQUIRED_FIELDS: FieldName[] = ['name', 'email', 'projectType', 'budget', 'deadline', 'description']

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://gaktvjyrdznirvxgsxem.supabase.co'
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_1GMgUV7oKU-sWiJ9_1XMIw_SPIcjWN5'

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
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [errors, setErrors] = useState<FieldErrors>({})

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    // Honeypot check against automated spam bots
    if (String(formData.get('website') ?? '').trim()) {
      return
    }
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    setStatus('loading')
    setStatusMessage('')

    const referenceRaw = String(formData.get('reference') ?? '').trim()
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      project_type: String(formData.get('projectType') ?? '').trim(),
      budget: String(formData.get('budget') ?? '').trim(),
      deadline: String(formData.get('deadline') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      reference_url: referenceRaw || null,
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let customMessage = ''
        try {
          const errorBody = (await response.json()) as { code?: string; message?: string }
          if (errorBody.code === 'P0001' && errorBody.message) {
            customMessage = errorBody.message
          }
        } catch {
          // Ignore JSON parse errors on non-JSON error responses
        }
        setStatus('error')
        setStatusMessage(
          customMessage || `Could not send inquiry right now. Please email ${portfolio.personal.email} directly.`,
        )
        return
      }

      form.reset()
      setErrors({})
      setStatus('success')
      setStatusMessage('Inquiry sent! Thank you — Nabin will review your project details and reply soon.')
    } catch {
      setStatus('error')
      setStatusMessage(`Network error while sending inquiry. Please email ${portfolio.personal.email} directly.`)
    }
  }

  const clearError = (field: FieldName) => {
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === 'success' || status === 'error') {
      setStatus('idle')
      setStatusMessage('')
    }
  }

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
        <label htmlFor="budget">Budget (NPR) <span aria-hidden="true">*</span></label>
        <select id="budget" name="budget" required defaultValue="" aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? 'budget-error' : undefined} onChange={() => clearError('budget')} onBlur={checkOnBlur('budget')}>
          <option value="" disabled>Select budget range</option>
          <option>NPR 1,000–2,500</option>
          <option>NPR 2,500–5,000</option>
          <option>NPR 5,000–7,500</option>
          <option>NPR 7,500–10,000</option>
          <option>NPR 10,000+</option>
          <option>Let’s discuss</option>
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
      <button className="submit-button" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending inquiry…' : status === 'success' ? 'Inquiry sent' : 'Send inquiry'}
        {status === 'success' ? <Check aria-hidden="true" /> : <Send aria-hidden="true" />}
      </button>
      <p
        className={`form-status ${status === 'error' ? 'is-error' : status === 'success' ? 'is-success' : ''}`}
        id="form-status"
        aria-live="polite"
      >
        {statusMessage || 'Required fields are marked *. Your inquiry is securely stored via Supabase.'}
      </p>
    </form>
  )
}
