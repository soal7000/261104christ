import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { courseList, researchList } from '../content'
import ResearchCard from '../components/ResearchCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle()
  const latest = researchList.slice(0, site.homeResearchCount)

  return (
    <div className="space-y-16">
      {/* 소개 */}
      <section className="max-w-2xl">
        <p className="mb-3 text-sm font-medium text-accent-600 dark:text-accent-300">
          {site.professor.name} {site.professor.title} · {site.professor.affiliation}
        </p>
        <h1 className="font-serif text-3xl leading-tight font-bold text-stone-900 sm:text-4xl dark:text-stone-50">{site.name}</h1>
        <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">{site.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/research" className="rounded bg-accent-700 px-5 py-2.5 font-medium text-white hover:bg-accent-800">
            연구 보기
          </Link>
          <Link
            to="/about"
            className="rounded border border-stone-300 px-5 py-2.5 font-medium hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
          >
            소개
          </Link>
        </div>
      </section>

      {/* 최신 연구 */}
      <section aria-labelledby="latest-research">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 id="latest-research" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
            최신 연구
          </h2>
          <Link to="/research" className="text-sm text-accent-700 hover:underline dark:text-accent-300">
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {latest.map((r) => (
            <ResearchCard key={r.id} item={r} />
          ))}
        </div>
      </section>

      {/* 수업 바로가기 */}
      <section aria-labelledby="course-shortcuts">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 id="course-shortcuts" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
            수업 바로가기
          </h2>
          <Link to="/courses" className="text-sm text-accent-700 hover:underline dark:text-accent-300">
            전체 보기 →
          </Link>
        </div>
        <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
          {courseList.map((c) => (
            <li key={c.id}>
              <Link
                to={`/courses/${c.id}`}
                className="flex flex-col gap-0.5 px-4 py-3 hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-stone-800"
              >
                <span className="font-medium text-stone-900 dark:text-stone-100">{c.title}</span>
                <span className="text-sm text-stone-500">{c.semester}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
