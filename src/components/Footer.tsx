import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { NAV } from './Header'
import Logo from './Logo'

export default function Footer() {
  const { contact, professor } = site
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-ink-3">{site.tagline}</p>
        </div>
        <nav aria-label="바닥글 메뉴">
          <h2 className="eyebrow mb-3 text-ink-3">메뉴</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-ink-2 hover:text-ink">홈</Link></li>
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="text-ink-2 hover:text-ink">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="eyebrow mb-3 text-ink-3">연락처</h2>
          <ul className="space-y-2 text-sm text-ink-2">
            <li>{professor.name} {professor.title}</li>
            {contact.email && <li><a href={`mailto:${contact.email}`} className="link">{contact.email}</a></li>}
            {contact.office && <li>{contact.office}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-ink-3 sm:flex-row sm:justify-between">
          <p>토론에 댓글을 작성하면 구글 계정 이름이 댓글에 공개됩니다.</p>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  )
}
