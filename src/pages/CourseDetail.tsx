import { useParams } from 'react-router-dom'
import { findCourse } from '../content'
import DetailLayout, { AsideBlock, JumpToDiscussion } from '../components/DetailLayout'
import Discussion from '../components/Discussion'
import LinkList from '../components/LinkList'
import NotFound from './NotFound'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { site } from '../content/site'

export default function CourseDetail() {
  const { id = '' } = useParams()
  const item = findCourse(id)
  useDocumentTitle(item?.title ?? '찾을 수 없음')
  if (!item) return <NotFound />

  return (
    <DetailLayout
      backTo="/courses"
      backLabel="수업 목록"
      eyebrow={`수업 · ${item.semester}`}
      title={item.title}
      lead={item.description}
      aside={
        <>
          <AsideBlock title="수업 정보">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-line pb-2">
                <dt className="text-ink-3">학기</dt>
                <dd className="text-ink">{item.semester}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line pb-2">
                <dt className="text-ink-3">담당</dt>
                <dd className="text-ink">
                  {site.professor.name} {site.professor.title}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-3">자료</dt>
                <dd className="text-ink">{item.materials.length}개</dd>
              </div>
            </dl>
          </AsideBlock>
          <div className="hidden lg:block">
            <JumpToDiscussion />
          </div>
        </>
      }
    >
      <section aria-labelledby="materials-title">
        <h2 id="materials-title" className="section-title mb-5 text-xl sm:text-2xl">
          수업 자료
        </h2>
        <LinkList items={item.materials} />
      </section>
      <Discussion targetType="course" targetId={item.id} />
    </DetailLayout>
  )
}
