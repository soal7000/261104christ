import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findResearch, loadBody } from '../content'
import DetailLayout, { AsideBlock, JumpToDiscussion } from '../components/DetailLayout'
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
    <DetailLayout
      backTo="/research"
      backLabel="연구 목록"
      eyebrow={`연구 · ${item.year}`}
      title={item.title}
      lead={item.summary}
      aside={
        <>
          {item.tags.length > 0 && (
            <AsideBlock title="태그">
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <Link key={t} to={`/research?tag=${encodeURIComponent(t)}`} aria-label={`${t} 태그 연구 보기`} className="rounded-md">
                    <Tag>{t}</Tag>
                  </Link>
                ))}
              </div>
            </AsideBlock>
          )}
          {item.links.length > 0 && (
            <AsideBlock title="관련 자료">
              <LinkList items={item.links} compact />
            </AsideBlock>
          )}
          <div className="hidden lg:block">
            <JumpToDiscussion />
          </div>
        </>
      }
    >
      {body === null ? (
        <div className="space-y-3" aria-label="본문을 불러오는 중">
          {[90, 100, 75].map((w) => (
            <div key={w} className="h-4 animate-pulse rounded bg-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : (
        <Markdown>{body}</Markdown>
      )}
      <Discussion targetType="research" targetId={item.id} />
    </DetailLayout>
  )
}
