import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { allTags, researchList } from '../content'
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

  return (
    <div>
      <PageHeader eyebrow="Research" title="연구">
        연구 결과와 발표 자료를 모았습니다. 각 연구 페이지에서 토론에 참여할 수 있습니다.
      </PageHeader>

      <div className="mb-8 space-y-4">
        <div>
          <label htmlFor="research-search" className="sr-only">
            연구 검색
          </label>
          <input
            id="research-search"
            type="search"
            value={q}
            onChange={(e) => update('q', e.target.value)}
            placeholder="제목, 요약, 태그, 연도로 검색"
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-base sm:max-w-md dark:border-stone-700 dark:bg-stone-900"
          />
        </div>
        <div role="group" aria-label="태그 필터" className="flex flex-wrap gap-2">
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

      <p className="mb-4 text-sm text-stone-500" aria-live="polite">
        {results.length}건
      </p>
      {results.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((r) => (
            <ResearchCard key={r.id} item={r} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-stone-300 px-4 py-10 text-center text-stone-500 dark:border-stone-700">
          조건에 맞는 연구가 없습니다.
        </p>
      )}
    </div>
  )
}

function TagButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active
          ? 'border-accent-700 bg-accent-700 text-white dark:border-accent-300 dark:bg-accent-300 dark:text-stone-950'
          : 'border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800'
      }`}
    >
      {children}
    </button>
  )
}
