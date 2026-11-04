import { site } from '../content/site'
import Icon, { type IconName } from '../components/Icon'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function About() {
  useDocumentTitle('소개')
  const { professor, contact } = site
  const contactRows: { icon: IconName; label: string; value: string; href?: string }[] = [
    { icon: 'mail' as const, label: '이메일', value: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
    { icon: 'pin' as const, label: '연구실', value: contact.office },
    { icon: 'clock' as const, label: '면담 시간', value: contact.officeHours },
  ].filter((r) => r.value)

  return (
    <div className="container-page grid gap-12 py-12 sm:py-16 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-20">
      {/* 프로필 */}
      <aside>
        <div className="lg:sticky lg:top-24">
          <div className="grid aspect-square w-32 place-items-center rounded-2xl bg-accent font-serif text-5xl font-bold text-accent-ink lg:w-full" aria-hidden="true">
            {professor.name[0]}
          </div>
          <h1 className="mt-6 font-serif text-3xl font-bold text-ink">
            {professor.name} <span className="text-xl font-medium text-ink-3">{professor.title}</span>
          </h1>
          <p className="mt-1 text-ink-3">{professor.affiliation}</p>

          <ul className="mt-8 space-y-4 border-t border-line pt-6">
            {contactRows.map((r) => (
              <li key={r.label} className="flex gap-3">
                <Icon name={r.icon} className="mt-0.5 h-5 w-5 shrink-0 text-ink-3" />
                <div className="min-w-0">
                  <p className="text-xs text-ink-3">{r.label}</p>
                  {r.href ? (
                    <a href={r.href} className="link break-all">
                      {r.value}
                    </a>
                  ) : (
                    <p className="text-ink">{r.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* 소개 본문 */}
      <div className="max-w-[44rem]">
        <p className="eyebrow mb-4">About</p>
        <div className="space-y-6 text-[1.0625rem] leading-[1.9] text-ink-2">
          {professor.bio.map((p, i) => (
            <p key={i} className={i === 0 ? 'font-serif text-xl leading-relaxed text-ink' : undefined}>
              {p}
            </p>
          ))}
        </div>

        {professor.interests.length > 0 && (
          <section aria-labelledby="interests" className="mt-14">
            <h2 id="interests" className="section-title mb-5 text-xl sm:text-2xl">
              연구 관심 분야
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {professor.interests.map((t, i) => (
                <li key={t} className="card flex items-center gap-3 px-4 py-3.5">
                  <span className="font-serif text-sm text-ink-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
