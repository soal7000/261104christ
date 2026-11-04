import type { LinkItem } from '../content'

/** 링크 종류를 URL로 추정해 작은 라벨을 붙입니다. */
function kindOf(url: string): string {
  if (/youtube\.com|youtu\.be/.test(url)) return '영상'
  if (/docs\.google\.com\/presentation/.test(url)) return '슬라이드'
  if (/docs\.google\.com\/document/.test(url)) return '문서'
  if (/drive\.google\.com/.test(url)) return 'Drive'
  if (/\.pdf($|\?)/i.test(url)) return 'PDF'
  if (url.startsWith('/')) return '파일'
  return '링크'
}

/** 관련 링크/수업 자료 목록 */
export default function LinkList({ items }: { items: LinkItem[] }) {
  if (!items.length) return <p className="text-stone-500">등록된 자료가 없습니다.</p>
  return (
    <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
      {items.map((item) => {
        const external = /^https?:\/\//.test(item.url)
        return (
          <li key={item.url + item.label}>
            <a
              href={item.url}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              <span className="text-accent-700 underline-offset-2 hover:underline dark:text-accent-300">{item.label}</span>
              <span className="shrink-0 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                {kindOf(item.url)}
                {external && <span className="sr-only"> (새 창에서 열림)</span>}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
