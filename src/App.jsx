import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useParams, useLocation } from 'react-router-dom'
import { projects, articles } from './data.js'

const img = (f) => `img/${f}`

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  const links = [['/', 'Home'], ['/about', 'About'], ['/portfolio', 'Portfolio'], ['/journal', 'Journal'], ['/contact', 'Contact']]
  return (
    <header className="nav">
      <Link to="/" className="brand">FAVOUR</Link>
      <nav className={`links ${open ? 'open' : ''}`} aria-label="Main">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
      </nav>
      <button className={`burger ${open ? 'x' : ''}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
    </header>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setOk(false); setMsg('Enter a valid email address.'); return }
    setOk(true); setMsg('Thanks. You are on the list. (This demo does not send email yet.)'); setEmail('')
  }
  return (
    <footer className="footer">
      <section className="news reveal">
        <p className="kicker">Newsletter</p>
        <h3>Letters from the studio</h3>
        <p className="muted">New portfolio work and journal pieces, once a month.</p>
        <form className="news-form" onSubmit={submit} noValidate>
          <label htmlFor="nl-email" className="sr">Email</label>
          <input id="nl-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">Subscribe</button>
        </form>
        {msg && <p className={`form-msg ${ok ? 'good' : 'bad'}`} role="status">{msg}</p>}
      </section>
      <div className="foot-row">
        <span className="brand">FAVOUR</span>
        <span className="muted">Editorial portfolio. Port Harcourt, Nigeria.</span>
        <span className="muted">© 2026 FAVOUR</span>
      </div>
    </footer>
  )
}

function Layout({ children }) {
  useReveal()
  return (<><ScrollTop /><Nav />{children}<Footer /></>)
}

function Home() {
  return (
    <main>
      <section className="hero">
        <img src={img('hero.jpg')} alt="Model in a deep green velvet blazer and black trousers against a grey concrete wall" />
        <div className="hero-copy">
          <p className="kicker">Editorial Portfolio · 2026</p>
          <h1>FAVOUR</h1>
          <p className="dek">Tailoring, green velvet and quiet gold. Studio work, runway and the stories behind them.</p>
          <div className="cta-row">
            <Link className="btn" to="/portfolio">View portfolio</Link>
            <Link className="btn ghost" to="/contact">Book a shoot</Link>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <p className="kicker">Selected work</p>
        <div className="teaser">
          {projects.filter((p) => !p.lifestyleOnly).slice(0, 3).map((p) => (
            <Link to={`/work/${p.id}`} key={p.id} className="tile">
              <img src={img(p.img)} alt={p.title} loading="lazy" />
              <span className="tile-cap">{p.title}</span>
            </Link>
          ))}
        </div>
        <Link className="more" to="/portfolio">All work →</Link>
      </section>

      <section className="section split reveal">
        <img src={img('about.jpg')} alt="Editorial studio portrait" loading="lazy" />
        <div>
          <p className="kicker">About</p>
          <h2>Built on stillness and structure.</h2>
          <p className="muted">Modelling for editorial, campaigns and runway. Working in studio light and on the open street.</p>
          <Link className="more" to="/about">Read more →</Link>
        </div>
      </section>

      <section className="section reveal">
        <p className="kicker">Journal</p>
        <div className="article-list">
          {articles.slice(0, 2).map((a) => (
            <Link to={`/journal/${a.id}`} key={a.id} className="article-card">
              <img src={img(a.img)} alt={a.title} loading="lazy" />
              <div><span className="kicker">{a.kicker}</span><h3>{a.title}</h3><p className="muted">{a.excerpt}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function About() {
  return (
    <main className="page">
      <section className="section split reveal">
        <img src={img('milan.jpg')} alt="Evening editorial portrait" />
        <div>
          <p className="kicker">About</p>
          <h1>FAVOUR</h1>
          <p>A model working across editorial, campaigns and runway. Known for controlled posture, strong lines and a palette that holds up on camera.</p>
          <p className="muted">Based in Port Harcourt, Nigeria. Available for studio shoots, location work and fittings.</p>
        </div>
      </section>
      <section className="section reveal">
        <p className="kicker">Approach</p>
        <div className="pillars">
          <div><h3>Discipline</h3><p className="muted">Clean posture, slow breath, the same frame held for the full set.</p></div>
          <div><h3>Palette</h3><p className="muted">Deep green, black, greige and gold. Pieces chosen to hold the room together.</p></div>
          <div><h3>Range</h3><p className="muted">Editorial, runway, campaign and lifestyle, in studio and outdoors.</p></div>
        </div>
      </section>
      <section className="section reveal">
        <img className="wide" src={img('runway2.jpg')} alt="Runway walk" loading="lazy" />
      </section>
    </main>
  )
}

const CATS = ['All', 'Editorial', 'Campaign', 'Runway', 'Jewellery', 'Lifestyle']

function Portfolio() {
  const [cat, setCat] = useState('All')
  const list = useMemo(() => (cat === 'All' ? projects.filter((p) => !p.lifestyleOnly) : projects.filter((p) => p.category === cat)), [cat])
  return (
    <main className="page">
      <section className="section">
        <p className="kicker">Portfolio</p>
        <h1>Selected work</h1>
        <div className="filters" role="group" aria-label="Filter by category">
          {CATS.map((c) => (
            <button key={c} className={cat === c ? 'on' : ''} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="masonry">
          {list.map((p) => (
            <Link to={`/work/${p.id}`} key={p.id} className={`mitem reveal${p.fit === 'natural' ? ' natural' : ''}`}>
              <img src={img(p.img)} alt={p.title} loading={p.fit === 'natural' ? 'eager' : 'lazy'} />
              <span className="mcap"><b>{p.title}</b><small>{p.category} · {p.year}</small></span>
            </Link>
          ))}
        </div>
        {list.length === 0 && <p className="muted">No work in this category yet.</p>}
      </section>
    </main>
  )
}

function Project() {
  const { id } = useParams()
  const p = projects.find((x) => x.id === id)
  if (!p) return (<main className="page section"><h1>Project not found</h1><Link to="/portfolio" className="more">Back to portfolio →</Link></main>)
  const i = projects.indexOf(p)
  const next = projects[(i + 1) % projects.length]
  return (
    <main className="page">
      <section className="section split reveal">
        <img src={img(p.img)} alt={p.title} className={p.fit === 'natural' ? 'natural' : undefined} />
        <div>
          <p className="kicker">{p.category} · {p.year}</p>
          <h1>{p.title}</h1>
          <p className="muted">{p.location}</p>
          <p>{p.body}</p>
          <Link className="more" to="/portfolio">← Back to portfolio</Link>
        </div>
      </section>
      <section className="section reveal">
        <Link className="more" to={`/work/${next.id}`}>Next: {next.title} →</Link>
      </section>
    </main>
  )
}

function Journal() {
  return (
    <main className="page section">
      <p className="kicker">Journal</p>
      <h1>Essays and notes</h1>
      <div className="article-list">
        {articles.map((a) => (
          <Link to={`/journal/${a.id}`} key={a.id} className="article-card reveal">
            <img src={img(a.img)} alt={a.title} loading="lazy" />
            <div><span className="kicker">{a.kicker} · {a.date} · {a.read}</span><h3>{a.title}</h3><p className="muted">{a.excerpt}</p></div>
          </Link>
        ))}
      </div>
    </main>
  )
}

function Article() {
  const { id } = useParams()
  const a = articles.find((x) => x.id === id)
  if (!a) return (<main className="page section"><h1>Article not found</h1><Link to="/journal" className="more">Back to journal →</Link></main>)
  return (
    <main className="page">
      <section className="section narrow reveal">
        <p className="kicker">{a.kicker} · {a.date} · {a.read}</p>
        <h1>{a.title}</h1>
        <img className="wide" src={img(a.img)} alt={a.title} />
        {a.body.map((para, i) => <p key={i} className="body-p">{para}</p>)}
        <Link className="more" to="/journal">← Back to journal</Link>
      </section>
    </main>
  )
}

function Contact() {
  const [f, setF] = useState({ name: '', email: '', type: 'Editorial', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const validate = () => {
    const e = {}
    if (f.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
    if (f.message.trim().length < 20) e.message = 'Tell us a bit more (at least 20 characters).'
    return e
  }
  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) { setStatus({ ok: false, text: 'Please fix the highlighted fields.' }); return }
    setStatus({ ok: false, text: 'This demo site has no mail server yet, so your message was not sent. Please email the studio directly.' })
  }
  return (
    <main className="page">
      <section className="section split reveal">
        <img src={img('sheer.jpg')} alt="Editorial portrait" loading="lazy" />
        <div>
          <p className="kicker">Contact</p>
          <h1>Book a shoot</h1>
          <form onSubmit={submit} noValidate className="form">
            <label>Name<input value={f.name} onChange={set('name')} /></label>
            {errors.name && <p className="err">{errors.name}</p>}
            <label>Email<input type="email" value={f.email} onChange={set('email')} /></label>
            {errors.email && <p className="err">{errors.email}</p>}
            <label>Project type
              <select value={f.type} onChange={set('type')}>
                <option>Editorial</option><option>Campaign</option><option>Runway</option><option>Other</option>
              </select>
            </label>
            <label>Message<textarea rows="5" value={f.message} onChange={set('message')} /></label>
            {errors.message && <p className="err">{errors.message}</p>}
            <button className="btn" type="submit">Send</button>
            {status && <p className={`form-msg ${status.ok ? 'good' : 'bad'}`} role="status">{status.text}</p>}
          </form>
        </div>
      </section>
    </main>
  )
}

function NotFound() {
  return (<main className="page section"><h1>Page not found</h1><Link to="/" className="more">Home →</Link></main>)
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/work/:id" element={<Project />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<Article />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
