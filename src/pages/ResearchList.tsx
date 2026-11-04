import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { allTags, researchList, type Research } from '../content'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import ResearchCard from '../components/ResearchCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/** 연구 목록: 태그 필터 + 키워드 검색 (모두 브라우저에서 처리, DB 조회 없음)
 *  검색 상태는 주소(?q=...&tag=...)에 저장되어 링크로 공유할 수 있습니다. */
export default function ResearchList() {
  useDocumentTitle('연구')
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const tag = params.get('tag') ?? ''

  const update = (key: 'q' | 'tag', value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    return researchList.filter((r) => {
      if (tag && !r.tags.includes(tag)) return false
      if (!keyword) return true
      const haystack = [r.title, r.summary, String(r.year), ...r.tags].join(' ').toLowerCase()
      return keyword.split(/\s+/).every((k) => haystack.includes(k))
    })
  }, [q, tag])

  // 연도별로 묶기 (researchList 가 이미 연도 내림차순)
  const byYear = useMemo(() => {
    const groups: { year: number; items: Research[] }[] = []
    for (const r of results) {
      const last = groups[groups.length - 1]
      if (last && last.year === r.year) last.items.push(r)
      else groups.push({ year: r.year, items: [r] })
    }
    return groups
  }, [results])

  return (
    <>
      <PageHeader eyebrow="Research" title="연구">
        연구 결과와 발표 자료를 모았습니다. 각 연구 페이지에서 토론에 참여할 수 있습니다.
      </PageHeader>

      <div className="container-page">
        {/* 검색·필터 */}
        <div className="sticky top-16 z-30 -mx-4 space-y-4 border-b border-line bg-paper/95 px-4 py-5 backdrop-blur-md sm:mx-0 sm:px-0">
          <div className="relative sm:max-w-md">
            <label htmlFor="research-search" className="sr-only">
              연구 검색
            </label>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-3" />
            <input
              id="research-search"
              type="search"
              value={q}
              onChange={(e) => update('q', e.target.value)}
              placeholder="제목, 요약, 태그, 연도로 검색"
              className="w-full rounded-lg border border-line bg-surface py-2.5 pr-4 pl-10 text-base text-ink placeholder:text-ink-3 focus:border-accent"
            />
          </div>
          <div role="group" aria-label="태그 필터" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            <TagButton active={!tag} onClick={() => update('tag', '')}>
              전체
            </TagButton>
            {allTags.map((t) => (
              <TagButton key={t} active={tag === t} onClick={() => update('tag', tag === t ? '' : t)}>
                {`#${t}`}
              </TagButton>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-ink-3" aria-live="polite">
          총 <strong className="font-semibold text-ink">{results.length}</strong>건
          {(q || tag) && (
            <button type="button" onClick={() => setParams({}, { replace: true })} className="link ml-3">
              조건 초기화
            </button>
          )}
        </p>

        {byYear.length ? (
          byYear.map((g) => (
            <section key={g.year} aria-label={`${g.year}년`} className="mt-6">
              <h2 className="border-b-2 border-ink pb-2 font-serif text-2xl font-bold text-ink tabular-nums">{g.year}</h2>
              <div className="divide-y divide-line">
                {g.items.map((r) => (
                  <ResearchCard key={r.id} item={r} showYear={false} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-line px-4 py-14 text-center text-ink-3">조건에 맞는 연구가 없습니다.</p>
        )}
      </div>
    </>
  )
}

function TagButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1 text-sm transition-colors ${
        active ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-ink-2 hover:border-ink-3'
      }`}
    >
      {children}
    </button>
  )
}
