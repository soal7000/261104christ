import { Link, useParams } from 'react-router-dom'
import { findCourse } from '../content'
import Discussion from '../components/Discussion'
import LinkList from '../components/LinkList'
import NotFound from './NotFound'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CourseDetail() {
  const { id = '' } = useParams()
  const item = findCourse(id)
  useDocumentTitle(item?.title ?? '찾을 수 없음')
  if (!item) return <NotFound />

  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="경로" className="mb-6 text-sm">
        <Link to="/courses" className="text-accent-700 hover:underline dark:text-accent-300">
          ← 수업 목록
        </Link>
      </nav>
      <header className="mb-8">
        <p className="text-sm text-stone-500">{item.semester}</p>
        <h1 className="mt-1 font-serif text-3xl leading-tight font-bold text-stone-900 sm:text-4xl dark:text-stone-50">{item.title}</h1>
      </header>
      <p className="mb-10 text-lg leading-8">{item.description}</p>

      <section aria-labelledby="materials-title">
        <h2 id="materials-title" className="mb-4 font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
          수업 자료
        </h2>
        <LinkList items={item.materials} />
      </section>

      <Discussion targetType="course" targetId={item.id} />
    </article>
  )
}
