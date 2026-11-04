import { Link } from 'react-router-dom'
import type { Research } from '../content'
import Icon from './Icon'
import Tag from './Tag'

/** 연구 항목 한 줄 (아카이브 목록형). showYear=false 이면 연도 열을 숨깁니다. */
export default function ResearchCard({ item, showYear = true }: { item: Research; showYear?: boolean }) {
  return (
    <article className="group relative grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[5rem_minmax(0,1fr)_auto]">
      {showYear ? (
        <p className="font-serif text-sm font-bold text-ink-3 tabular-nums sm:pt-1">{item.year}</p>
      ) : (
        <span className="hidden sm:block" />
      )}
      <div className="min-w-0">
        <h3 className="font-serif text-xl leading-snug font-bold text-ink transition-colors group-hover:text-accent-text">
          {/* 줄 전체를 클릭 가능하게: 링크의 ::after 를 항목 위에 펼침 */}
          <Link to={`/research/${item.id}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 max-w-2xl text-ink-3">{item.summary}</p>
        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>
      <Icon name="arrow" className="hidden h-5 w-5 self-center text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-accent-text sm:block" />
    </article>
  )
}
