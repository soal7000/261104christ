import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findResearch, loadBody } from '../content'
import Discussion from '../components/Discussion'
import LinkList from '../components/LinkList'
import Markdown from '../components/Markdown'
import Tag from '../components/Tag'
import NotFound from './NotFound'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function ResearchDetail() {
  const { id = '' } = useParams()
  const item = findResearch(id)
  useDocumentTitle(item?.title ?? '찾을 수 없음')
  const [body, setBody] = useState<string | null>(null)

  useEffect(() => {
    if (!item) return
    let cancelled = false
    setBody(null)
    loadBody(item.body).then((text) => !cancelled && setBody(text))
    return () => {
      cancelled = true
    }
  }, [item])

  if (!item) return <NotFound />

  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="경로" className="mb-6 text-sm">
        <Link to="/research" className="text-accent-700 hover:underline dark:text-accent-300">
          ← 연구 목록
        </Link>
      </nav>
      <header className="mb-8">
        <p className="text-sm text-stone-500">{item.year}</p>
        <h1 className="mt-1 font-serif text-3xl leading-tight font-bold text-stone-900 sm:text-4xl dark:text-stone-50">{item.title}</h1>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <Link key={t} to={`/research?tag=${encodeURIComponent(t)}`} aria-label={`${t} 태그 연구 보기`}>
              <Tag>{t}</Tag>
            </Link>
          ))}
        </div>
      </header>

      <section aria-label="요약" className="mb-10 rounded-lg bg-white p-5 dark:bg-stone-900">
        <h2 className="mb-2 text-sm font-semibold text-stone-500">요약</h2>
        <p className="text-lg leading-8">{item.summary}</p>
      </section>

      {body === null ? <p className="text-stone-500">본문을 불러오는 중…</p> : <Markdown>{body}</Markdown>}

      {item.links.length > 0 && (
        <section aria-labelledby="links-title" className="mt-12">
          <h2 id="links-title" className="mb-4 font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
            관련 링크
          </h2>
          <LinkList items={item.links} />
        </section>
      )}

      <Discussion targetType="research" targetId={item.id} />
    </article>
  )
}
