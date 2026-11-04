import type { LinkItem } from '../content'
import Icon, { type IconName } from './Icon'

/** 링크 종류를 URL로 추정해 아이콘과 라벨을 붙입니다. */
function kindOf(url: string): { label: string; icon: IconName } {
  if (/youtube\.com|youtu\.be|vimeo\.com/.test(url)) return { label: '영상', icon: 'video' }
  if (/docs\.google\.com\/presentation/.test(url)) return { label: '슬라이드', icon: 'slides' }
  if (/docs\.google\.com\/document/.test(url)) return { label: '문서', icon: 'doc' }
  if (/\.pdf($|\?)/i.test(url)) return { label: 'PDF', icon: 'pdf' }
  if (/drive\.google\.com/.test(url)) return { label: 'Drive', icon: 'folder' }
  if (url.startsWith('/')) return { label: '파일', icon: 'doc' }
  return { label: '링크', icon: 'link' }
}

/** 관련 링크/수업 자료 목록 */
export default function LinkList({ items, compact = false }: { items: LinkItem[]; compact?: boolean }) {
  if (!items.length) return <p className="text-ink-3">등록된 자료가 없습니다.</p>
  return (
    <ul className={compact ? 'space-y-1' : 'card divide-y divide-line overflow-hidden'}>
      {items.map((item) => {
        const external = /^https?:\/\//.test(item.url)
        const kind = kindOf(item.url)
        return (
          <li key={item.url + item.label}>
            <a
              href={item.url}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`group flex items-center gap-3 transition-colors ${
                compact ? '-mx-2 rounded-lg px-2 py-2 hover:bg-paper' : 'px-4 py-3.5 hover:bg-paper sm:px-5'
              }`}
            >
              <span className={`grid shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text ${compact ? 'h-8 w-8' : 'h-10 w-10'}`}>
                <Icon name={kind.icon} className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block font-medium text-ink group-hover:text-accent-text ${compact ? 'text-sm' : ''}`}>{item.label}</span>
                {!compact && <span className="block text-xs text-ink-3">{kind.label}</span>}
              </span>
              <Icon name={external ? 'external' : 'arrow'} className="h-4 w-4 shrink-0 text-ink-3 group-hover:text-accent-text" />
              {external && <span className="sr-only">(새 창에서 열림)</span>}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
