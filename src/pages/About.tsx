import { site } from '../content/site'
import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function About() {
  useDocumentTitle('소개')
  const { professor, contact } = site
  const contactRows = [
    { label: '이메일', value: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
    { label: '연구실', value: contact.office },
    { label: '면담 시간', value: contact.officeHours },
  ].filter((r) => r.value)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="About" title={`${professor.name} ${professor.title}`}>
        {professor.affiliation}
      </PageHeader>

      <section className="space-y-5 text-[1.0625rem] leading-8">
        {professor.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      {professor.interests.length > 0 && (
        <section aria-labelledby="interests" className="mt-12">
          <h2 id="interests" className="mb-3 font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
            연구 관심 분야
          </h2>
          <ul className="flex flex-wrap gap-2">
            {professor.interests.map((t) => (
              <li key={t} className="rounded-full border border-stone-300 px-3 py-1 text-sm dark:border-stone-700">
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="contact" className="mt-12">
        <h2 id="contact" className="mb-3 font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
          연락처
        </h2>
        <dl className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
          {contactRows.map((r) => (
            <div key={r.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-6">
              <dt className="w-24 shrink-0 text-sm text-stone-500">{r.label}</dt>
              <dd>
                {r.href ? (
                  <a href={r.href} className="text-accent-700 hover:underline dark:text-accent-300">
                    {r.value}
                  </a>
                ) : (
                  r.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
