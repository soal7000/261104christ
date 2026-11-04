import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { courseList, researchList } from '../content'
import CourseCard from '../components/CourseCard'
import Icon, { type IconName } from '../components/Icon'
import ResearchCard from '../components/ResearchCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'book', title: '자료 읽기', text: '연구와 수업 자료를 누구나 자유롭게 읽을 수 있습니다.' },
  { icon: 'login', title: '구글 로그인', text: '토론에 참여하려면 구글 계정으로 로그인합니다.' },
  { icon: 'chat', title: '토론 참여', text: '각 자료 하단에 질문과 의견을 남기고 함께 생각을 나눕니다.' },
]

export default function Home() {
  useDocumentTitle()
  const latest = researchList.slice(0, site.homeResearchCount)
  const { professor } = site

  return (
    <>
      {/* 히어로 */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="ruled pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow mb-5">{professor.affiliation}</p>
            <h1 className="font-serif text-[2.6rem] leading-[1.15] font-bold tracking-tight text-ink sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl">{site.tagline}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/research" className="btn-primary">
                연구 둘러보기 <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link to="/courses" className="btn-ghost">
                수업 자료
              </Link>
            </div>
          </div>

          {/* 교수 소개 카드 */}
          <aside className="card p-6 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.2)] sm:p-7" aria-label="운영자 소개">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-accent font-serif text-xl font-bold text-accent-ink" aria-hidden="true">
                {professor.name[0]}
              </span>
              <div>
                <p className="font-serif text-lg font-bold text-ink">
                  {professor.name} <span className="text-base font-medium text-ink-3">{professor.title}</span>
                </p>
                <p className="text-sm text-ink-3">{professor.affiliation}</p>
              </div>
            </div>
            <p className="mt-5 line-clamp-4 text-[0.95rem] leading-relaxed text-ink-2">{professor.bio[0]}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {professor.interests.map((t) => (
                <li key={t} className="rounded-md border border-line px-2 py-0.5 text-xs text-ink-2">
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/about" className="link mt-5 inline-flex items-center gap-1 text-sm font-medium no-underline">
              소개 더 보기 <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </aside>
        </div>
      </section>

      {/* 최신 연구 */}
      <section aria-labelledby="latest-research" className="container-page py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
          <div>
            <p className="eyebrow mb-2">Research</p>
            <h2 id="latest-research" className="section-title">
              최신 연구
            </h2>
          </div>
          <Link to="/research" className="link shrink-0 text-sm no-underline">
            전체 보기 →
          </Link>
        </div>
        <div className="divide-y divide-line">
          {latest.map((r) => (
            <ResearchCard key={r.id} item={r} />
          ))}
        </div>
      </section>

      {/* 수업 */}
      <section aria-labelledby="course-shortcuts" className="border-y border-line bg-surface/60">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Courses</p>
              <h2 id="course-shortcuts" className="section-title">
                수업 바로가기
              </h2>
            </div>
            <Link to="/courses" className="link shrink-0 text-sm no-underline">
              전체 보기 →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {courseList.slice(0, 3).map((c, i) => (
              <CourseCard key={c.id} item={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 참여 방법 */}
      <section aria-labelledby="how-to" className="container-page pt-16 sm:pt-20">
        <h2 id="how-to" className="section-title mb-8">
          토론 참여 방법
        </h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent-text">
                <Icon name={s.icon} />
              </span>
              <div>
                <p className="font-semibold text-ink">
                  <span className="mr-1.5 font-serif text-ink-3 tabular-nums">{i + 1}.</span>
                  {s.title}
                </p>
                <p className="mt-1 text-[0.95rem] text-ink-3">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
