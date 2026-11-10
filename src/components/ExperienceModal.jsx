import { useEffect, useState } from 'react'
import { X, CalendarDays, ChevronDown } from 'lucide-react'

const empty = { title: '', company: '', employmentType: '', location: '', startDate: '', endDate: '', current: false, description: '' }
const inputClass = 'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 hover:border-slate-500 focus:border-linkedin focus:ring-4 focus:ring-blue-100'
const labelClass = 'text-[13px] font-semibold text-slate-700'

export default function ExperienceModal({ open, onClose, onSave, editing }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setForm(editing ? {
      title: editing.title || '', company: editing.company || '',
      employmentType: editing.employmentType || '', location: editing.location || '',
      startDate: editing.startDate || '', endDate: editing.endDate || '',
      current: Boolean(editing.current), description: editing.description || ''
    } : empty)
    setErrors({})
  }, [open, editing])

  useEffect(() => {
    if (!open) return
    const keyHandler = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', keyHandler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', keyHandler); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open) return null

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Please enter a job title.'
    if (!form.company.trim()) next.company = 'Please enter a company name.'
    if (!form.employmentType) next.employmentType = 'Please select an employment type.'
    if (!form.location.trim()) next.location = 'Please enter a location.'
    if (!form.startDate) next.startDate = 'Please select a start date.'
    if (!form.current && !form.endDate) next.endDate = 'Select an end date or mark this as your current role.'
    if (form.startDate && form.endDate && form.endDate < form.startDate) next.endDate = 'End date cannot be earlier than start date.'
    if (!form.description.trim()) next.description = 'Please add a short description.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSave({ ...form, title: form.title.trim(), company: form.company.trim(), location: form.location.trim(), description: form.description.trim(), endDate: form.current ? '' : form.endDate })
  }

  const textField = (name, label, placeholder) => (
    <div>
      <label className={labelClass} htmlFor={name}>{label} <span className="text-rose-500">*</span></label>
      <input id={name} value={form[name]} onChange={e => update(name, e.target.value)} placeholder={placeholder} className={inputClass} autoComplete="off" />
      {errors[name] && <p className="mt-1 text-xs text-rose-600">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="modal-scroll max-h-[94vh] w-full max-w-[680px] overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-linkedin">Profile details</p><h2 id="modal-title" className="mt-1 font-display text-xl font-extrabold text-ink">{editing ? 'Edit experience' : 'Add experience'}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close form" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="space-y-5 px-6 py-6">
          <div className="rounded-xl bg-blue-50 px-4 py-3 text-[13px] leading-5 text-blue-900">Add a role to your profile. Fields marked with <span className="font-bold text-rose-600">*</span> are required.</div>
          {textField('title', 'Title', 'e.g. Software Engineer')}
          {textField('company', 'Company name', 'e.g. Infosys')}
          <div>
            <label className={labelClass} htmlFor="employmentType">Employment type <span className="text-rose-500">*</span></label>
            <div className="relative">
              <select id="employmentType" value={form.employmentType} onChange={e => update('employmentType', e.target.value)} className={`${inputClass} appearance-none pr-10`}>
                <option value="">Please select</option>
                {['Full-time','Part-time','Self-employed','Freelance','Contract','Internship','Apprenticeship','Seasonal'].map(type => <option key={type}>{type}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
            {errors.employmentType && <p className="mt-1 text-xs text-rose-600">{errors.employmentType}</p>}
          </div>
          {textField('location', 'Location', 'e.g. Bengaluru, Karnataka, India')}
          <div>
            <label className={labelClass} htmlFor="startDate">Start date <span className="text-rose-500">*</span></label>
            <div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="startDate" type="month" value={form.startDate} onChange={e => update('startDate', e.target.value)} className={`${inputClass} pl-9`} /></div>
            {errors.startDate && <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="endDate">End date</label>
            <div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="endDate" type="month" min={form.startDate || undefined} value={form.endDate} disabled={form.current} onChange={e => update('endDate', e.target.value)} className={`${inputClass} pl-9 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`} /></div>
            {errors.endDate && <p className="mt-1 text-xs text-rose-600">{errors.endDate}</p>}
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/40">
            <input type="checkbox" checked={form.current} onChange={e => { const checked = e.target.checked; setForm(prev => ({ ...prev, current: checked, endDate: checked ? '' : prev.endDate })); setErrors(prev => ({ ...prev, endDate: '' })) }} className="mt-0.5 h-4 w-4 accent-[#0a66c2]" />
            <span><span className="block text-sm font-semibold text-ink">I am currently working in this role</span><span className="mt-0.5 block text-xs text-slate-500">The end date will display as Present.</span></span>
          </label>
          <div>
            <label className={labelClass} htmlFor="description">Description <span className="text-rose-500">*</span></label>
            <textarea id="description" rows="5" maxLength={2000} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe your responsibilities, achievements and skills..." className={`${inputClass} resize-y`} />
            <div className="mt-1 flex justify-between gap-3">{errors.description ? <p className="text-xs text-rose-600">{errors.description}</p> : <p className="text-xs text-slate-500">Highlight your impact and key responsibilities.</p>}<span className="shrink-0 text-xs text-slate-400">{form.description.length}/2000</span></div>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-full border border-slate-400 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="submit" className="rounded-full bg-linkedin px-7 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200">{editing ? 'Save changes' : 'Save'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}