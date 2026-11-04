import { Link } from 'react-router-dom'
import type { Course } from '../content'

export default function CourseCard({ item }: { item: Course }) {
  return (
    <article className="group relative rounded-lg border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
      <p className="text-sm text-stone-500 dark:text-stone-400">{item.semester}</p>
      <h3 className="mt-1 font-serif text-lg font-bold text-stone-900 dark:text-stone-50">
        <Link to={`/courses/${item.id}`} className="after:absolute after:inset-0 group-hover:text-accent-700 dark:group-hover:text-accent-300">
          {item.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.95rem] text-stone-600 dark:text-stone-400">{item.description}</p>
      <p className="mt-3 text-sm text-stone-500">자료 {item.materials.length}개</p>
    </article>
  )
}
