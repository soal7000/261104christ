import { courseList } from '../content'
import CourseCard from '../components/CourseCard'
import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CourseList() {
  useDocumentTitle('수업')
  return (
    <>
      <PageHeader eyebrow="Courses" title="수업">
        수업별 강의 자료를 모았습니다. 각 수업 페이지에서 질문과 토론을 남겨 주세요.
      </PageHeader>
      <div className="container-page grid gap-5 py-12 md:grid-cols-2 lg:grid-cols-3">
        {courseList.map((c, i) => (
          <CourseCard key={c.id} item={c} index={i} />
        ))}
      </div>
    </>
  )
}
