import { useState } from 'react';
import {
  Search, Bookmark, Share2, Building2, Clock, X, Upload, CheckCircle2,
  ArrowLeft, ChevronRight, MapPin, Phone, Mail, Globe, Facebook,
  Instagram, Plane, Map, Users, Star, Award, Heart, Send
} from 'lucide-react';
import { jobPostings, type JobPosting, type EmploymentType } from '../../data/recruitmentData';
import corazonLogo from '@/imports/Screenshot_2026-06-18_at_10.57.47_PM.png';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

// ── Brand ─────────────────────────────────────────────────────────────────────
const B = {
  crimson: '#6E1216', crimsonD: '#5A0D10', crimsonDeep: '#3D0A0C',
  gold: '#C8890A', goldBrt: '#E8A800',
  cream: '#FBF7F1', creamMd: '#F0E6D8', border: '#E8D8C8',
  text: '#2A1215', muted: '#7A5C50',
};

type NavPage = 'home' | 'about' | 'services' | 'careers' | 'contact';
type FilterType = 'All' | EmploymentType | 'Saved Jobs';
const FILTERS: FilterType[] = ['All', 'Full Time', 'Part Time', 'Contractual', 'Internship', 'Saved Jobs'];
const publicJobs = jobPostings.filter(j => j.publishToBoard && j.status !== 'Draft');
const typeColor: Record<string, string> = {
  'Full Time': 'bg-red-50 text-primary', 'Part Time': 'bg-purple-50 text-purple-700',
  'Contractual': 'bg-amber-50 text-amber-700', 'Internship': 'bg-emerald-50 text-emerald-700',
};

// ── Top Nav ───────────────────────────────────────────────────────────────────
function Nav({ page, setPage, onBack }: { page: NavPage; setPage: (p: NavPage) => void; onBack?: () => void }) {
  const links: { id: NavPage; label: string }[] = [
    { id: 'home', label: 'Home' }, { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' }, { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' },
  ];
  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm" style={{ borderColor: B.border }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <button onClick={() => setPage('home')} className="flex-shrink-0">
          <div className="rounded-xl overflow-hidden" style={{ background: B.crimson, padding: '4px 10px' }}>
            <ImageWithFallback src={corazonLogo} alt="Corazon Travel and Tours" className="h-8 w-auto object-contain" />
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={page === l.id ? { background: B.crimson, color: '#fff' } : { color: B.muted }}>
              {l.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setPage('careers')}
            className="hidden sm:block px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: B.gold }}>
            Apply Now
          </button>
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border"
              style={{ borderColor: B.border, color: B.muted }}>
              <ArrowLeft size={12} /> System
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: NavPage) => void }) {
  return (
    <footer style={{ background: B.crimsonDeep, borderTop: `3px solid ${B.gold}` }}>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-4 gap-8">
        <div>
          <div className="rounded-xl overflow-hidden inline-block mb-4" style={{ background: B.crimson, padding: '5px 10px' }}>
            <ImageWithFallback src={corazonLogo} alt="Corazon" className="h-9 w-auto object-contain" />
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,245,233,0.45)' }}>
            Making every journey memorable since 2010.
          </p>
        </div>
        {[
          { title: 'Company', links: [['Home','home'],['About Us','about'],['Services','services'],['Contact','contact']] },
          { title: 'Services', links: [['Domestic Tours','services'],['International','services'],['Honeymoon','services'],['Corporate','services']] },
          { title: 'Careers', links: [['Open Positions','careers'],['Internships','careers'],['Why Join Us','about']] },
        ].map(col => (
          <div key={col.title}>
            <div className="text-xs font-bold mb-3" style={{ color: `${B.goldBrt}99` }}>{col.title}</div>
            <ul className="space-y-1.5">
              {col.links.map(([label, id]) => (
                <li key={label}>
                  <button onClick={() => setPage(id as NavPage)} className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,245,233,0.45)' }}>{label}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t px-6 py-4 text-center text-xs" style={{ borderColor: 'rgba(255,235,180,0.08)', color: 'rgba(255,245,233,0.25)' }}>
        © 2026 Corazon Travel and Tours · Taguig City, Philippines · All rights reserved
      </div>
    </footer>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: NavPage) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 text-center" style={{ background: `linear-gradient(135deg, ${B.crimson}, ${B.crimsonD})` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${B.gold}, ${B.goldBrt}, ${B.gold})` }} />
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: `${B.gold}25`, color: B.goldBrt, border: `1px solid ${B.gold}40` }}>
            <Plane size={12} /> Explore · Discover · Travel
          </span>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Your Journey Begins<br />
            <span style={{ color: B.goldBrt }}>Here with Corazon</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            World-class travel experiences across the Philippines and beyond. Crafted with passion, delivered with care.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => setPage('services')} className="px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              style={{ background: B.goldBrt, color: B.crimsonD, boxShadow: `0 6px 20px ${B.gold}55` }}>
              Explore Our Tours
            </button>
            <button onClick={() => setPage('careers')} className="px-8 py-3.5 rounded-xl font-bold text-sm text-white border-2 hover:bg-white/10 transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.35)' }}>
              Join Our Team
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: B.creamMd }}>
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-4 gap-6">
          {[['15+', 'Years of Experience'], ['500+', 'Tours Completed'], ['10,000+', 'Happy Travelers'], ['50+', 'Destinations']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-4xl font-bold mb-1" style={{ color: B.crimson }}>{v}</div>
              <div className="text-sm font-semibold" style={{ color: B.muted }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2" style={{ color: B.text }}>What We Offer</h2>
          <p className="text-sm" style={{ color: B.muted }}>Tailored travel experiences for every explorer</p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {[
            { icon: Plane, title: 'Domestic Tours', desc: 'Discover the Philippines — Palawan, Boracay, Siargao, Bohol and more. Something for every budget.', color: B.crimson },
            { icon: Globe, title: 'International Tours', desc: 'Japan, Korea, Singapore, Dubai, Europe — guided group tours with accommodation included.', color: B.gold },
            { icon: Map, title: 'Custom Packages', desc: 'We craft personalized itineraries based on your preferences, schedule, and budget. Your trip, your way.', color: '#7C3AED' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl p-6 border hover:shadow-md transition-all group" style={{ borderColor: B.border }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}15` }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: B.text }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: B.muted }}>{s.desc}</p>
                <button onClick={() => setPage('services')} className="flex items-center gap-1 text-xs font-bold transition-all" style={{ color: s.color }}>
                  Learn more <ChevronRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured jobs */}
      {publicJobs.length > 0 && (
        <section style={{ background: B.cream }}>
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: B.text }}>Join Our Team</h2>
                <p className="text-sm mt-0.5" style={{ color: B.muted }}>Current openings at Corazon</p>
              </div>
              <button onClick={() => setPage('careers')} className="flex items-center gap-1 text-sm font-bold" style={{ color: B.crimson }}>
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {publicJobs.slice(0, 3).map(job => (
                <div key={job.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-all" style={{ borderColor: B.border }}>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 ${typeColor[job.employmentType]}`}>{job.employmentType}</span>
                  <h3 className="font-bold text-sm mb-1" style={{ color: B.text }}>{job.title}</h3>
                  <div className="text-xs mb-4 flex items-center gap-1" style={{ color: B.muted }}><Building2 size={11} /> {job.department}</div>
                  <button onClick={() => setPage('careers')}
                    className="w-full py-2 rounded-xl text-xs font-bold border-2 transition-all"
                    style={{ borderColor: B.crimson, color: B.crimson }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.background = B.crimson; b.style.color = '#fff'; }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.background = 'transparent'; b.style.color = B.crimson; }}>
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="rounded-3xl p-12 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${B.crimson}, ${B.crimsonD})` }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <h2 className="text-3xl font-bold text-white mb-3 relative">Ready to Explore the World?</h2>
          <p className="text-white/60 mb-8 relative">Contact us and let's plan your perfect getaway.</p>
          <div className="flex items-center justify-center gap-4 relative">
            <button onClick={() => setPage('contact')} className="px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all" style={{ background: B.goldBrt, color: B.crimsonD }}>Get in Touch</button>
            <button onClick={() => setPage('services')} className="px-8 py-3 rounded-xl font-bold text-sm text-white border-2 hover:bg-white/10 transition-all" style={{ borderColor: 'rgba(255,255,255,0.35)' }}>View Packages</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div>
      <section className="py-16 text-center" style={{ background: B.cream }}>
        <div className="absolute top-0 left-0 right-0 h-1 relative" style={{ background: `linear-gradient(90deg, ${B.gold}, ${B.goldBrt}, ${B.gold})` }} />
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: `${B.crimson}15`, color: B.crimson }}>Our Story</span>
          <h1 className="text-4xl font-bold mb-4" style={{ color: B.text }}>About Corazon Travel & Tours</h1>
          <p className="text-base leading-relaxed" style={{ color: B.muted }}>
            Founded in 2010 in Taguig City, Corazon Travel and Tours was born from a dream —
            to make meaningful travel accessible to every Filipino.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: B.text }}>From a Small Office to a Trusted Name</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: B.muted }}>
              We started as a two-person operation. Over 15 years, we grew into one of Metro Manila's most trusted travel agencies,
              with 50+ professionals dedicated to crafting unforgettable journeys.
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: B.muted }}>
              We specialize in domestic Philippine tours, international group packages, corporate travel, and custom honeymoon itineraries.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[['Founded','2010'],['Headquarters','Taguig City'],['Team Size','50+ employees'],['Destinations','50+ worldwide']].map(([l,v]) => (
                <div key={l} className="rounded-xl p-4" style={{ background: B.creamMd, border: `1px solid ${B.border}` }}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: B.muted }}>{l}</div>
                  <div className="text-sm font-bold" style={{ color: B.text }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl relative flex flex-col items-center justify-center p-12 text-center min-h-72" style={{ background: `linear-gradient(135deg, ${B.crimson}, ${B.crimsonD})` }}>
            <div className="absolute inset-0 opacity-10 rounded-2xl" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <Plane size={44} className="text-white/25 mb-4" />
            <div className="text-5xl font-bold text-white mb-2">15+</div>
            <div className="text-white/60 text-sm">Years Creating<br />Memorable Journeys</div>
            <div className="w-10 h-1 rounded-full mt-5" style={{ background: B.goldBrt }} />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ background: B.cream }}>
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 gap-6">
          {[
            { title: 'Our Mission', body: 'To provide accessible, well-organized, and memorable travel experiences that enrich the lives of our clients while upholding the highest standards of service, safety, and value.' },
            { title: 'Our Vision', body: "To become the Philippines' most trusted and innovative travel company — inspiring every Filipino to explore the world with confidence and joy." },
          ].map(mv => (
            <div key={mv.title} className="bg-white rounded-2xl p-8 border" style={{ borderColor: B.border }}>
              <div className="w-10 h-1 rounded-full mb-4" style={{ background: B.crimson }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: B.text }}>{mv.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: B.muted }}>{mv.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-center mb-10" style={{ color: B.text }}>Our Core Values</h2>
        <div className="grid grid-cols-4 gap-5">
          {[
            { icon: Heart, title: 'Passion for Travel', desc: 'Every trip we craft is infused with genuine care.' },
            { icon: Users, title: 'Customer First', desc: 'We listen, customize, and deliver beyond expectations.' },
            { icon: Star, title: 'Excellence', desc: 'Highest standards in service, safety, and hospitality.' },
            { icon: Award, title: 'Trust & Integrity', desc: '15 years of honest dealings and fair pricing.' },
          ].map(v => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="text-center p-6 rounded-2xl border hover:shadow-sm transition-all" style={{ borderColor: B.border }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${B.crimson}12` }}>
                  <Icon size={22} style={{ color: B.crimson }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: B.text }}>{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: B.muted }}>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section style={{ background: B.cream }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: B.text }}>Meet Our Leadership</h2>
          <div className="grid grid-cols-4 gap-5">
            {[['Corazon Reyes','Founder & CEO','CR','Since 2010'],['Marco Santos','Operations Director','MS','Since 2012'],['Lea Garcia','Head of Tours','LG','Since 2015'],['Paolo Cruz','Marketing Manager','PC','Since 2018']].map(([name,role,ini,since]) => (
              <div key={name} className="bg-white rounded-2xl border p-6 text-center hover:shadow-sm transition-all" style={{ borderColor: B.border }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold"
                  style={{ background: `linear-gradient(135deg, ${B.crimson}, ${B.crimsonD})` }}>{ini}</div>
                <div className="font-bold text-sm" style={{ color: B.text }}>{name}</div>
                <div className="text-xs mt-0.5" style={{ color: B.crimson }}>{role}</div>
                <div className="text-xs mt-1" style={{ color: B.muted }}>{since}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── SERVICES ──────────────────────────────────────────────────────────────────
function ServicesPage({ setPage }: { setPage: (p: NavPage) => void }) {
  const services = [
    { icon: Plane,  color: B.crimson, title: 'Domestic Tours',         subtitle: 'Explore the Philippines',   from: '₱4,500',        packages: ['Palawan Island Hopping (3D2N)','Boracay Beach Escape (4D3N)','Siargao Surfing Adventure (5D4N)','Batanes Cultural Tour (6D5N)','Bohol Heritage & Nature (4D3N)'], desc: 'Discover the natural wonders of the Philippines — pristine beaches, rich heritage, and breathtaking landscapes.' },
    { icon: Globe,  color: B.gold,    title: 'International Tours',    subtitle: 'See the World',              from: '₱35,000',       packages: ['Japan Cherry Blossom (7D6N)','Korea K-Culture (8D7N)','Singapore & Malaysia (6D5N)','Dubai Luxury Getaway (7D6N)','Europe Grand Tour (14D13N)'], desc: 'Guided international tours with accommodation and expert guides included across Asia and beyond.' },
    { icon: Heart,  color: '#7C3AED', title: 'Honeymoon Packages',    subtitle: 'For Couples',                from: '₱28,000',       packages: ['Bali Romantic Retreat (7D6N)','Maldives Island Villa (6D5N)','Paris & Rome in Love (10D9N)','Boracay Couples Escape (4D3N)','Palawan Private Island (5D4N)'], desc: 'Make your special moments unforgettable with romantic destinations, private dinners, and spa treatments.' },
    { icon: Users,  color: '#059669', title: 'Group & Corporate',      subtitle: 'Team Building & Events',    from: '₱3,200 / pax',  packages: ['Team Building Packages','Educational Tours','Corporate Retreats','Incentive Travel Programs','Convention & MICE Services'], desc: 'From annual company outings to large group tours — we handle all logistics so you can focus on bonding.' },
    { icon: Map,    color: '#D97706', title: 'Custom Itineraries',     subtitle: 'Your Trip, Your Way',        from: 'Price on request', packages: ['Solo Travel Planning','Family Reunion Trips','Anniversary Special','Religious & Pilgrimage Tours','Adventure & Extreme Sports'], desc: "Can't find a package that fits? Our consultants craft a personalized itinerary just for you." },
    { icon: Star,   color: B.crimson, title: 'Insurance & Visa',       subtitle: 'Worry-Free Travel',          from: '₱800 / pax',    packages: ['Comprehensive Travel Insurance','Medical & Emergency Coverage','Visa Application Assistance','Passport Renewal Assistance','Travel Document Consultation'], desc: 'Comprehensive travel insurance and visa processing for most countries — stress-free from start to finish.' },
  ];

  return (
    <div>
      <section className="py-14 text-center" style={{ background: B.cream }}>
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: `${B.crimson}15`, color: B.crimson }}>Our Services</span>
          <h1 className="text-4xl font-bold mb-4" style={{ color: B.text }}>Everything for Your Dream Trip</h1>
          <p className="text-base leading-relaxed" style={{ color: B.muted }}>From budget-friendly local getaways to luxury international tours — we have a package for every traveler.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 gap-6">
          {services.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all" style={{ borderColor: B.border }}>
                <div className="px-6 py-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
                    <Icon size={22} style={{ color: s.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold mb-0.5" style={{ color: s.color }}>{s.subtitle}</div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: B.text }}>{s.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: B.muted }}>{s.desc}</p>
                  </div>
                </div>
                <div className="px-6 pb-5">
                  <div className="rounded-xl p-4 mb-4" style={{ background: B.cream }}>
                    <div className="text-xs font-bold mb-2" style={{ color: B.muted }}>Sample Packages:</div>
                    <ul className="space-y-1">
                      {s.packages.map(p => (
                        <li key={p} className="flex items-center gap-2 text-xs" style={{ color: B.text }}>
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.color }} />{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs" style={{ color: B.muted }}>Starting from </span>
                      <span className="text-sm font-bold" style={{ color: s.color }}>{s.from}</span>
                    </div>
                    <button onClick={() => setPage('contact')} className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all" style={{ background: s.color }}>Inquire Now</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ background: B.cream }}>
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: B.text }}>Not sure which package to choose?</h2>
          <p className="text-sm mb-8" style={{ color: B.muted }}>Our travel consultants are ready to help you plan the perfect trip.</p>
          <button onClick={() => setPage('contact')} className="px-8 py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
            style={{ background: B.crimson, boxShadow: `0 6px 20px ${B.crimson}55` }}>Talk to a Consultant</button>
        </div>
      </section>
    </div>
  );
}

// ── CAREERS ───────────────────────────────────────────────────────────────────
function CareersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [saved, setSaved] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applyJob, setApplyJob] = useState<JobPosting | null>(null);
  const [appForm, setAppForm] = useState({ name: '', email: '', phone: '', resume: '', coverLetter: '' });
  const [appSuccess, setAppSuccess] = useState(false);

  const filtered = publicJobs.filter(j => {
    const ms = !search || j.title.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' || (filter === 'Saved Jobs' ? saved.includes(j.id) : j.employmentType === filter);
    return ms && mf;
  });

  function openApply(job: JobPosting) {
    setApplyJob(job); setAppForm({ name: '', email: '', phone: '', resume: '', coverLetter: '' }); setAppSuccess(false);
  }

  if (selectedJob && !applyJob) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-sm font-bold mb-6 hover:gap-3 transition-all" style={{ color: B.crimson }}>
          <ArrowLeft size={14} /> Back to Jobs
        </button>
        <div className="bg-white rounded-2xl border p-8 shadow-sm" style={{ borderColor: B.border }}>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${typeColor[selectedJob.employmentType]}`}>{selectedJob.employmentType}</span>
          <h1 className="text-2xl font-bold mb-2" style={{ color: B.text }}>{selectedJob.title}</h1>
          <div className="flex items-center gap-4 text-sm mb-6" style={{ color: B.muted }}>
            <span className="flex items-center gap-1.5"><Building2 size={14} />{selectedJob.department}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} />Deadline: {selectedJob.deadline}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl" style={{ background: B.cream }}>
            <div><div className="text-xs mb-0.5" style={{ color: B.muted }}>Slots</div><div className="text-sm font-bold" style={{ color: B.text }}>{selectedJob.slots}</div></div>
            <div><div className="text-xs mb-0.5" style={{ color: B.muted }}>Type</div><div className="text-sm font-bold" style={{ color: B.text }}>{selectedJob.employmentType}</div></div>
            <div><div className="text-xs mb-0.5" style={{ color: B.muted }}>Department</div><div className="text-sm font-bold" style={{ color: B.text }}>{selectedJob.department}</div></div>
          </div>
          <div className="space-y-5">
            <div><h3 className="font-bold mb-2" style={{ color: B.text }}>Job Description</h3><p className="text-sm leading-relaxed" style={{ color: B.muted }}>{selectedJob.description}</p></div>
            <div><h3 className="font-bold mb-2" style={{ color: B.text }}>Qualifications</h3><p className="text-sm leading-relaxed" style={{ color: B.muted }}>{selectedJob.qualifications}</p></div>
          </div>
          <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: `1px solid ${B.border}` }}>
            <button onClick={() => openApply(selectedJob)} className="flex-1 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
              style={{ background: B.crimson, boxShadow: `0 4px 14px ${B.crimson}55` }}>Apply Now</button>
            <button onClick={() => setSaved(s => s.includes(selectedJob.id) ? s.filter(x => x !== selectedJob.id) : [...s, selectedJob.id])}
              className="px-5 py-3 rounded-xl font-bold text-sm border-2 transition-colors" style={{ borderColor: B.border, color: saved.includes(selectedJob.id) ? B.crimson : B.muted }}>
              <Bookmark size={16} fill={saved.includes(selectedJob.id) ? B.crimson : 'none'} />
            </button>
          </div>
        </div>
        {applyJob && <ApplyModal job={applyJob} appForm={appForm} setAppForm={setAppForm} appSuccess={appSuccess} onSuccess={() => setAppSuccess(true)} onClose={() => setApplyJob(null)} />}
      </div>
    );
  }

  return (
    <div>
      <section className="py-14 text-center" style={{ background: B.cream }}>
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: `${B.crimson}15`, color: B.crimson }}>Careers at Corazon</span>
          <h1 className="text-3xl font-bold mb-3" style={{ color: B.text }}>Grow With Us</h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: B.muted }}>Join a team passionate about travel, people, and making every journey memorable.</p>
          <div className="flex max-w-xl mx-auto gap-2 bg-white rounded-2xl border p-2 shadow-sm" style={{ borderColor: B.border }}>
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: B.muted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search positions…"
                className="w-full pl-9 pr-3 py-2.5 bg-transparent text-sm outline-none" style={{ color: B.text }} />
            </div>
            <button className="px-6 py-2.5 rounded-xl text-white text-sm font-bold" style={{ background: B.crimson }}>Search</button>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-20 bg-white border-b px-8 py-3" style={{ borderColor: B.border }}>
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => {
            const count = f === 'All' ? publicJobs.length : f === 'Saved Jobs' ? saved.length : publicJobs.filter(j => j.employmentType === f).length;
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
                style={active ? { background: B.crimson, borderColor: B.crimson, color: '#fff' } : { borderColor: B.border, color: B.muted }}>
                {f} <span className="text-xs px-1.5 py-0.5 rounded-full" style={active ? { background: 'rgba(255,255,255,0.2)' } : { background: B.creamMd }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm mb-6" style={{ color: B.muted }}>Showing <strong style={{ color: B.text }}>{filtered.length}</strong> position{filtered.length !== 1 ? 's' : ''}</p>
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: B.muted }}>No positions match your search.</div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {filtered.map(job => (
              <div key={job.id} className="bg-white rounded-2xl border p-5 flex flex-col hover:shadow-md transition-all" style={{ borderColor: B.border }}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${typeColor[job.employmentType]}`}>{job.employmentType}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setSaved(s => s.includes(job.id) ? s.filter(x => x !== job.id) : [...s, job.id])}
                      className="p-1.5 rounded-lg" style={{ color: saved.includes(job.id) ? B.crimson : '#D1D5DB' }}>
                      <Bookmark size={14} fill={saved.includes(job.id) ? B.crimson : 'none'} />
                    </button>
                    <button className="p-1.5 rounded-lg" style={{ color: '#D1D5DB' }}><Share2 size={14} /></button>
                  </div>
                </div>
                <h3 className="font-bold text-sm mb-1 leading-tight" style={{ color: B.text }}>{job.title}</h3>
                <div className="flex items-center gap-1 text-xs mb-3" style={{ color: B.muted }}><Building2 size={11} /> {job.department}</div>
                <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: B.muted }}>{job.description.slice(0, 100)}…</p>
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => setSelectedJob(job)} className="flex-1 py-2 rounded-xl border text-xs font-bold transition-colors" style={{ borderColor: B.border, color: B.text }}>View Details</button>
                  <button onClick={() => openApply(job)} className="flex-1 py-2 rounded-xl text-xs font-bold text-white" style={{ background: B.crimson }}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {applyJob && <ApplyModal job={applyJob} appForm={appForm} setAppForm={setAppForm} appSuccess={appSuccess} onSuccess={() => setAppSuccess(true)} onClose={() => setApplyJob(null)} />}
    </div>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  }

  const inp = (extra = '') => `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${extra}`;

  return (
    <div>
      <section className="py-14 text-center" style={{ background: B.cream }}>
        <div className="max-w-2xl mx-auto px-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: `${B.crimson}15`, color: B.crimson }}>Get In Touch</span>
          <h1 className="text-3xl font-bold mb-3" style={{ color: B.text }}>We'd Love to Hear From You</h1>
          <p className="text-sm leading-relaxed" style={{ color: B.muted }}>Planning a trip, inquiring about a job, or just want to say hello — our team is ready.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-5 gap-8">
        <div className="col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-6" style={{ color: B.text }}>Contact Information</h2>
          {[
            { icon: MapPin, label: 'Head Office', value: 'Unit 5, BGC Corporate Tower, Taguig City, Metro Manila 1634' },
            { icon: Phone, label: 'Phone', value: '+63 2 8888 1234 / +63 917 123 4567' },
            { icon: Mail, label: 'Email', value: 'hello@corazontravelandtours.ph' },
            { icon: Clock, label: 'Office Hours', value: 'Mon–Fri: 8:00 AM – 6:00 PM\nSat: 9:00 AM – 3:00 PM' },
          ].map(i => {
            const Icon = i.icon;
            return (
              <div key={i.label} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: B.cream, border: `1px solid ${B.border}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${B.crimson}12` }}>
                  <Icon size={18} style={{ color: B.crimson }} />
                </div>
                <div>
                  <div className="text-xs font-bold mb-0.5" style={{ color: B.muted }}>{i.label}</div>
                  <div className="text-sm font-semibold whitespace-pre-line" style={{ color: B.text }}>{i.value}</div>
                </div>
              </div>
            );
          })}
          <div className="pt-2">
            <div className="text-xs font-bold mb-3" style={{ color: B.muted }}>Follow Us</div>
            <div className="flex gap-2">
              {[Facebook, Instagram, Globe].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all hover:bg-red-50" style={{ borderColor: B.border }}>
                  <Icon size={16} style={{ color: B.crimson }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-2xl border p-8" style={{ borderColor: B.border }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: B.text }}>Send Us a Message</h2>
          {sent ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4"><CheckCircle2 size={32} className="text-emerald-500" /></div>
              <h3 className="text-lg font-bold mb-2" style={{ color: B.text }}>Message Sent!</h3>
              <p className="text-sm" style={{ color: B.muted }}>We'll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[['name','Full Name *','Juan dela Cruz','text',true],['email','Email *','juan@email.com','email',true]].map(([k,l,p,t,r]) => (
                  <div key={k as string}>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: B.text }}>{l as string}</label>
                    <input type={t as string} value={(form as any)[k as string]} onChange={e => setForm(f => ({ ...f, [k as string]: e.target.value }))}
                      placeholder={p as string} required={r as boolean} className={inp()}
                      style={{ borderColor: B.border, background: B.cream, color: B.text }}
                      onFocus={e => (e.target.style.borderColor = B.gold)} onBlur={e => (e.target.style.borderColor = B.border)} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: B.text }}>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+63 9XX XXX XXXX"
                    className={inp()} style={{ borderColor: B.border, background: B.cream, color: B.text }}
                    onFocus={e => (e.target.style.borderColor = B.gold)} onBlur={e => (e.target.style.borderColor = B.border)} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: B.text }}>Subject *</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required
                    className={inp('cursor-pointer')} style={{ borderColor: B.border, background: B.cream, color: form.subject ? B.text : B.muted }}>
                    <option value="">Select a topic</option>
                    {['Tour Inquiry','Custom Package','Job Application','Travel Insurance','Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: B.text }}>Message *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5}
                  placeholder="Tell us what you need…" className={inp('resize-none')}
                  style={{ borderColor: B.border, background: B.cream, color: B.text }}
                  onFocus={e => (e.target.style.borderColor = B.gold)} onBlur={e => (e.target.style.borderColor = B.border)} />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                style={{ background: B.crimson, boxShadow: `0 4px 14px ${B.crimson}55` }}>
                <Send size={15} /> Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

// ── Apply Modal ───────────────────────────────────────────────────────────────
function ApplyModal({ job, appForm, setAppForm, appSuccess, onSuccess, onClose }: {
  job: JobPosting; appForm: any; setAppForm: (f: any) => void;
  appSuccess: boolean; onSuccess: () => void; onClose: () => void;
}) {
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); onSuccess(); }
  const inp = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: B.border }}>
          <div>
            <h3 className="font-bold" style={{ color: B.text }}>Apply — {job.title}</h3>
            <p className="text-xs mt-0.5" style={{ color: B.muted }}>{job.department}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-50" style={{ color: B.muted }}><X size={18} /></button>
        </div>
        {appSuccess ? (
          <div className="flex flex-col items-center text-center px-8 py-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4"><CheckCircle2 size={32} className="text-emerald-500" /></div>
            <h3 className="text-xl font-bold mb-2" style={{ color: B.text }}>Application Submitted!</h3>
            <p className="text-sm leading-relaxed" style={{ color: B.muted }}>We'll review your application for <strong>{job.title}</strong> and get back to you.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl text-white text-sm font-bold" style={{ background: B.crimson }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {[['name','Full Name','Juan dela Cruz','text',true],['email','Email','juan@email.com','email',true],['phone','Contact Number','+63 9XX XXX XXXX','text',false]].map(([k,l,p,t,r]) => (
              <div key={k as string}>
                <label className="block text-xs font-bold mb-1.5" style={{ color: B.text }}>{l as string} {r && <span className="text-red-500">*</span>}</label>
                <input type={t as string} value={appForm[k as string]} onChange={e => setAppForm((f: any) => ({ ...f, [k as string]: e.target.value }))}
                  placeholder={p as string} required={r as boolean} className={inp}
                  style={{ borderColor: B.border, background: B.cream, color: B.text }}
                  onFocus={e => (e.target.style.borderColor = B.gold)} onBlur={e => (e.target.style.borderColor = B.border)} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: B.text }}>Resume (PDF) <span className="text-red-500">*</span></label>
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                style={{ borderColor: appForm.resume ? B.crimson : B.border, background: B.cream }}>
                <Upload size={16} style={{ color: B.muted }} />
                <span className="text-sm font-semibold" style={{ color: appForm.resume ? B.text : B.muted }}>{appForm.resume || 'Click to upload resume'}</span>
                <input type="file" accept=".pdf" className="hidden" onChange={e => setAppForm((f: any) => ({ ...f, resume: e.target.files?.[0]?.name ?? '' }))} />
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: B.text }}>Cover Letter <span className="text-xs font-normal" style={{ color: B.muted }}>(optional)</span></label>
              <textarea value={appForm.coverLetter} onChange={e => setAppForm((f: any) => ({ ...f, coverLetter: e.target.value }))}
                rows={4} placeholder="Tell us why you're a great fit…" className={inp + ' resize-none'}
                style={{ borderColor: B.border, background: B.cream, color: B.text }}
                onFocus={e => (e.target.style.borderColor = B.gold)} onBlur={e => (e.target.style.borderColor = B.border)} />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all"
              style={{ background: B.crimson, boxShadow: `0 4px 14px ${B.crimson}55` }}>Submit Application</button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function JobBoard({ onBack }: { onBack?: () => void }) {
  const [page, setPage] = useState<NavPage>('home');
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Nunito, system-ui, sans-serif', background: '#fff' }}>
      <Nav page={page} setPage={setPage} onBack={onBack} />
      <main className="flex-1">
        {page === 'home'     && <HomePage     setPage={setPage} />}
        {page === 'about'    && <AboutPage />}
        {page === 'services' && <ServicesPage setPage={setPage} />}
        {page === 'careers'  && <CareersPage />}
        {page === 'contact'  && <ContactPage />}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
