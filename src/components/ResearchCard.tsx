import { Link } from 'react-router-dom'
import type { Research } from '../content'
import Tag from './Tag'

export default function ResearchCard({ item }: { item: Research }) {
  return (
    <article className="group relative rounded-lg border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
      <p className="text-sm text-stone-500 dark:text-stone-400">{item.year}</p>
      <h3 className="mt-1 font-serif text-lg leading-snug font-bold text-stone-900 dark:text-stone-50">
        {/* 카드 전체를 클릭 가능하게: 링크의 ::after 를 카드 위에 펼침 */}
        <Link to={`/research/${item.id}`} className="after:absolute after:inset-0 group-hover:text-accent-700 dark:group-hover:text-accent-300">
          {item.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.95rem] text-stone-600 dark:text-stone-400">{item.summary}</p>
      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
    </article>
  )
}
