import { useEffect, useMemo, useState } from 'react'
import { Linkedin, Search, Home, Users, BriefcaseBusiness, MessageCircle, Bell, ChevronDown, CheckCircle2, MapPin, Plus, Pencil, GraduationCap, Mail, Globe2, Sparkles, Activity, Award, Code2, ExternalLink } from 'lucide-react'
import ExperienceModal from './components/ExperienceModal'
import ExperienceCard from './components/ExperienceCard'
import { demoExperiences, profile } from './data/demoData'

const STORAGE_KEY = 'linkedin1-experiences-v1'

function getInitialExperiences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === null) return demoExperiences
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : demoExperiences
  } catch { return demoExperiences }
}

const tabs = ['About', 'Experience', 'Education', 'Skills', 'Activity']

export default function App() {
  const [experiences, setExperiences] = useState(getInitialExperiences)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState('Experience')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(experiences)) }
    catch { setToast('Could not save changes in this browser.') }
  }, [experiences])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const sorted = useMemo(
    () => [...experiences].sort((a, b) => (b.startDate || '').localeCompare(a.startDate || '')),
    [experiences]
  )

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = item => { setEditing(item); setModalOpen(true) }

  const saveExperience = values => {
    if (editing) {
      setExperiences(prev => prev.map(item => item.id === editing.id ? { ...item, ...values } : item))
      setToast('Experience updated successfully')
    } else {
      const id = globalThis.crypto?.randomUUID?.() || `experience-${Date.now()}`
      setExperiences(prev => [...prev, { ...values, id }])
      setToast('Experience added successfully')
    }
    setModalOpen(false)
    setEditing(null)
  }

  const deleteExperience = id => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return
    setExperiences(prev => prev.filter(item => item.id !== id))
    setToast('Experience deleted')
  }

  return (
    <div className="min-h-screen bg-canvas pb-12">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[62px] max-w-[1128px] items-center gap-5 px-4">
          <a href="#" aria-label="Home" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-linkedin text-white"><Linkedin size={25} fill="white" /></a>
          <div className="hidden max-w-[350px] flex-1 items-center gap-2 rounded-md bg-[#edf3f8] px-3 py-2.5 md:flex"><Search size={17} className="text-slate-600" /><span className="text-sm text-slate-500">Search</span></div>
          <nav aria-label="Main navigation" className="ml-auto flex h-full items-center gap-1 sm:gap-5">
            {[[Home,'Home'],[Users,'My Network'],[BriefcaseBusiness,'Jobs'],[MessageCircle,'Messaging'],[Bell,'Notifications']].map(([Icon,label]) => (
              <button type="button" key={label} className={`nav-item ${label === 'Home' ? 'nav-item-active' : ''}`}><Icon size={19} /><span>{label}</span></button>
            ))}
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-1"><img src={profile.avatar} alt="Profile" className="h-7 w-7 rounded-full object-cover" /><ChevronDown size={13} className="text-slate-500" /></div>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1128px] grid-cols-1 gap-5 px-3 pt-5 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] md:px-4">
        <div className="space-y-3">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="profile-cover h-[150px] sm:h-[190px]" />
            <div className="px-5 pb-5 sm:px-7">
              <div className="-mt-14 flex items-end justify-between">
                <img src={profile.avatar} alt={`${profile.name} profile portrait`} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-sm sm:h-32 sm:w-32" />
                <button type="button" onClick={openAdd} className="mb-2 rounded-full border border-linkedin px-4 py-2 text-sm font-bold text-linkedin transition hover:bg-blue-50"><Pencil size={15} className="mr-1.5 inline" /> Add experience</button>
              </div>
              <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row">
                <div className="max-w-[570px]">
                  <div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{profile.name}</h1><CheckCircle2 size={17} className="text-linkedin" /></div>
                  <p className="mt-1 text-[14px] leading-6 text-slate-700">{profile.headline}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[13px] text-slate-500"><MapPin size={14} /> {profile.location} <span>·</span><a href="#contact" className="font-semibold text-linkedin hover:underline">Contact info</a></p>
                  <p className="mt-2 text-[13px] font-semibold text-linkedin">500+ connections</p>
                </div>
                <div className="flex items-start gap-2 sm:max-w-[190px]"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-amber-50 text-amber-700"><GraduationCap size={18} /></div><p className="pt-1 text-[12px] font-semibold leading-4 text-slate-700">{profile.education}</p></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => setActiveTab('About')} className="rounded-full bg-linkedin px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"><Plus size={16} className="mr-1 inline" /> Add profile section</button>
                <button type="button" onClick={openAdd} className="rounded-full border border-linkedin px-5 py-2.5 text-sm font-bold text-linkedin transition hover:bg-blue-50">Add experience</button>
                <button type="button" onClick={() => setToast('')} className="rounded-full border border-slate-500 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100">More</button>
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto border-t border-slate-200 px-5 sm:px-7">
              {tabs.map(tab => <button type="button" key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 py-3 text-sm font-semibold transition ${activeTab === tab ? 'border-linkedin text-linkedin' : 'border-transparent text-slate-500 hover:text-ink'}`}>{tab}</button>)}
            </div>
          </section>

          {activeTab === 'Experience' && <section className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-7">
            <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-xl font-extrabold text-ink">Experience</h2><p className="mt-1 text-xs text-slate-500">Showcase professional roles, responsibilities and achievements.</p></div><button type="button" onClick={openAdd} aria-label="Add experience" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-linkedin"><Plus size={23} /></button></div>
            {sorted.length > 0 ? <div className="mt-5 divide-y divide-slate-200">{sorted.map(item => <ExperienceCard key={item.id} experience={item} onEdit={openEdit} onDelete={deleteExperience} />)}</div> : <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-linkedin"><BriefcaseBusiness size={22} /></div><h3 className="mt-3 font-display font-bold text-ink">No experience added yet</h3><p className="mt-1 text-sm text-slate-500">Add your first role to show your professional journey.</p><button type="button" onClick={openAdd} className="mt-4 rounded-full bg-linkedin px-5 py-2 text-sm font-bold text-white hover:bg-blue-800">Add experience</button></div>}
            <p className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">Changes are saved automatically in this browser.</p>
          </section>}

          {activeTab === 'About' && <section className="profile-section"><h2>About</h2><p>Computer Science graduate and full stack developer passionate about creating responsive, accessible and user-friendly web applications. Interested in modern frontend development, React, UI design and AI-powered solutions.</p></section>}

          {activeTab === 'Skills' && <section className="profile-section"><h2>Skills</h2><p className="section-subtitle">Professional skills and areas of expertise.</p><div className="mt-4 flex flex-wrap gap-2">{['React.js','JavaScript','HTML5','CSS3','Tailwind CSS','Java','Python','PHP','Laravel','SQL','Git & GitHub','Responsive Design','REST APIs','UI Development'].map(skill => <span key={skill} className="skill-chip">{skill}</span>)}</div></section>}

          {activeTab === 'Education' && <section className="profile-section"><h2>Education</h2><div className="mt-4 flex gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-linkedin"><GraduationCap size={24}/></div><div><h3 className="font-bold text-ink">{profile.education}</h3><p className="mt-1 text-sm text-slate-600">Bachelor’s degree · Computer Science</p><p className="mt-1 text-xs text-slate-500">Undergraduate studies</p></div></div></section>}

          {activeTab === 'Activity' && <section className="profile-section"><div className="flex items-center gap-2"><Activity size={20} className="text-linkedin"/><h2>Activity</h2></div><p className="mt-3">No recent posts to show. Your profile activity will appear here.</p></section>}

          <section id="contact" className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-7"><h2 className="font-display text-lg font-extrabold">Contact</h2><div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600"><Mail size={17} /> {profile.email}</div><div className="mt-2 flex items-center gap-3 text-sm text-slate-600"><Globe2 size={17} /> India</div></section>
        </div>

        <aside className="space-y-3">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-display text-base font-extrabold text-ink">Profile language</h2><p className="mt-2 text-[13px] text-slate-500">English</p><div className="my-4 border-t border-slate-200" /><h2 className="font-display text-base font-extrabold text-ink">Public profile & URL</h2><p className="mt-2 break-all text-[13px] text-slate-500">{profile.publicUrl}</p></section>
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85" alt="Colleagues collaborating in an office" className="h-32 w-full object-cover" /><div className="p-5"><div className="flex items-center gap-2 text-linkedin"><Sparkles size={17} /><span className="text-xs font-bold uppercase tracking-wider">Profile tip</span></div><h3 className="mt-2 font-display font-extrabold">Make your experience stand out</h3><p className="mt-1 text-[13px] leading-5 text-slate-500">Add measurable achievements, tools you used and the impact you made in each role.</p></div></section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-display text-sm font-extrabold">Quick actions</h3><button type="button" onClick={openAdd} className="mt-3 flex w-full items-center justify-between rounded-lg bg-blue-50 px-3 py-3 text-left text-sm font-semibold text-linkedin transition hover:bg-blue-100">Add a new experience <Plus size={16} /></button><p className="mt-3 text-xs leading-5 text-slate-500">Use the options menu beside an experience to edit or delete it.</p></section>
        </aside>
      </main>

      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>}
      <ExperienceModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} onSave={saveExperience} editing={editing} />
    </div>
  )
}
