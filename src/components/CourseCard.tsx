import { Link } from 'react-router-dom'
import type { Course } from '../content'
import Icon from './Icon'

export default function CourseCard({ item, index }: { item: Course; index?: number }) {
  return (
    <article className="card group relative flex h-full flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-ink-3 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-text">{item.semester}</span>
        {index !== undefined && <span className="font-serif text-sm text-ink-3 tabular-nums">{String(index + 1).padStart(2, '0')}</span>}
      </div>
      <h3 className="mt-4 font-serif text-xl leading-snug font-bold text-ink group-hover:text-accent-text">
        <Link to={`/courses/${item.id}`} className="after:absolute after:inset-0">
          {item.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-[0.95rem] text-ink-3">{item.description}</p>
      <p className="mt-5 flex items-center gap-1.5 border-t border-line pt-4 text-sm text-ink-3">
        <Icon name="book" className="h-4 w-4" />
        자료 {item.materials.length}개
        <Icon name="arrow" className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-accent-text" />
      </p>
    </article>
  )
}
