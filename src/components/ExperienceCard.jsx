import { useState } from 'react'
import { Building2, CalendarDays, MapPin, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

function formatMonth(value) {
  if (!value) return ''
  const [year, month] = value.split('-')
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export default function ExperienceCard({ experience, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const range = `${formatMonth(experience.startDate)} – ${experience.current ? 'Present' : formatMonth(experience.endDate)}`
  return (
    <article className="group flex gap-4 py-5 first:pt-1 last:pb-1">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 text-linkedin ring-1 ring-slate-200"><Building2 size={23} /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><h3 className="break-words font-display text-base font-extrabold leading-snug text-ink">{experience.title}</h3><p className="mt-1 text-sm font-medium text-slate-700">{experience.company} <span className="text-slate-400">·</span> {experience.employmentType}</p></div>
          <div className="relative shrink-0">
            <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label={`Options for ${experience.title}`} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 sm:opacity-0 sm:group-hover:opacity-100"><MoreHorizontal size={20} /></button>
            {menuOpen && <><button aria-label="Close menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} /><div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"><button type="button" onClick={() => { onEdit(experience); setMenuOpen(false) }} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-slate-50"><Pencil size={15} /> Edit</button><button type="button" onClick={() => { onDelete(experience.id); setMenuOpen(false) }} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"><Trash2 size={15} /> Delete</button></div></>}
          </div>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-slate-500"><CalendarDays size={14} /> {range}</p>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-500"><MapPin size={14} /> {experience.location}</p>
        <p className="mt-3 whitespace-pre-line break-words text-[13.5px] leading-6 text-slate-700">{experience.description}</p>
      </div>
    </article>
  )
}